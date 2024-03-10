import React,{ 
  useState,
  createContext,
  useEffect,
} from "react";
import { ThemeProvider } from "./ThemeProvider";
import Toast from "react-native-root-toast";
import { loginApi, registerApi, ws_url } from "../api";
import { setData } from "../utils/storage";
import * as Notifications from 'expo-notifications';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState('')
  // websocket
  const [ws, setWs] = useState(null);
  // 心跳
  const [heartbeat, setHeartbeat] = useState(null);
  const [msgs, setMessages] = useState([]);
  const [hasNotiPremission, setHasNotiPremission] = useState(false);
  var lockReconnect = false;
  var reconnectCount = 0; // 重连次数，超过10次自动不连！

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    Toast.show(res.msg,{position: Toast.positions.CENTER});
    if(res.data){
      const data = res.data.token;
      setData('user', res.data.user);
      setToken(data);
    }else {
      console.log(res.msg)
    }
  };
  const register = async (email, password, code) => {
    const res = await registerApi(email, password, code);
    Toast.show(res.msg, {position: Toast.positions.CENTER});
    if(res.data){
      const data = res.data.token;
      setData('user', res.data.user);
      setToken(data);
    }else {
      console.log(res.msg)
    }
  };
  const logout = () => {
    Toast.show('退出成功', {position: Toast.positions.CENTER});
    setToken(null);
  }
  const createWebSocket = () => {
    try {
      const newWs = new WebSocket(`ws://${ws_url}`);
      setWs(newWs);
    } catch (e) {
      console.log('websocket error: ', e);
      websocketReconnect();
    }
  };

  const websocketInit = () => {
    // 连接websocket时触发:进行连接并设置心跳
    ws.onopen = () => {
      console.log('WebSocket已连接!');
      console.log('WebSocket连接状态:', ws._socketId);
      reconnectCount = 0;
      ws.send(JSON.stringify({"code": 10001,token: token}));
      // 添加心跳定时器，每隔一段时间发送心跳消息
      const heartbeatInterval = setupHeartbeat(ws);
      setHeartbeat(heartbeatInterval);
    };
    ws.onmessage = (e) => {
      console.log('收到消息:', e.data);
      const newMessage = JSON.parse(e.data);
      setMessages(newMessage);
      handlerNotification(newMessage);
    }
    // 关闭时触发
    ws.onclose = (e) => {
      console.log('WebSocket已关闭:', e);
      // 每过几秒，尝试重连！
      websocketReconnect();
    };
    // 通信发生错误时触发
    ws.onerror = (e) => {
      console.log('websocket 错误: ', e)
      // websocketReconnect();
    };
  }
  const setupHeartbeat = (webSocket) => {
    return setInterval(() => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify({"code": 10086}));
      }
    }, 7000); // 7秒发送一次心跳消息
  };

  const getNotificationsPremissions = () => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        setHasNotiPremission(true);
      }else{
        console.log('通知权限未授予');
      }
    })
  }

  const handlerNotification = async (msg) => {
    if(msg.createdAt && msg.user){
      let title = ''
      let body = ''
      if(msg.system){
        title = '系统消息'
        body = msg.text;
      }else{
        title = msg.user.name;
        if(msg.text){
          body = msg.text;
        }
        if(msg.image){
          body = '[图片]';
        }
        if(msg.video){
          body = '[视频]';
        }
        if(msg.audio){
          body = '[语音]';
        }
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: body,
          },
          trigger: null // 立即发送
        })
      }
    }
  }

  useEffect(()=>{
    getNotificationsPremissions();
  }, []);

  useEffect(()=> {
    if(token){
      createWebSocket();
    }
    // 函数执行完毕后触发
    return () => {
      if(ws){
        ws.close();
        clearInterval(heartbeat);
      }
    };
  }, [token]);
  
  useEffect(() => {
    if(ws){
      websocketInit();
    }
  }, [ws]);

  const websocketReconnect = ()=> {
    if(lockReconnect){
      return;
    }
    if(reconnectCount >= 10){
      Toast.show('无法连接到网络，请清理后台并重新启动',{position: Toast.positions.CENTER})
      return;
    }
    console.log('尝试重连...')
    reconnectCount += 1;
    // Toast.show('正在重连网络中...',{position: Toast.positions.TOP})
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
    var tt = setTimeout(function () {
      createWebSocket();
      lockReconnect = false;
    }, 7000);
  }

  return (
    <ThemeProvider>
      <AuthContext.Provider
        value={{ 
          token, setToken,
          login, register, logout,
          ws, msgs,
          hasNotiPremission
         }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  )
}
