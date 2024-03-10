import React, {useState, useEffect, useContext, useRef} from 'react';
import {View,Text, SafeAreaView, StyleSheet, FlatList, } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { ThemeContext } from '../../navigation/ThemeProvider';
import { pre_url, getFriendMsgApi, readFriendMsgApi, getGroupMsgApi, readGroupMsgApi } from '../../api';
import BubbleMessage from '../../components/chat/Bubble';
import ChatInput from '../../components/input/ChatInput';
import { getData } from '../../utils/storage';
import Toast from 'react-native-root-toast';

const ChatScreen = ({navigation, route}) => {
  const {theme} = useContext(ThemeContext);
  const {token, msgs} = React.useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const fid = route.params.id;
  const isGroup = route.params.isGroup;
  const [user,setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    getUser();
    getMsg();
    readMsg();
  },[]);

  useEffect(()=> {
    receivedMsg();
    setTimeout(() => {
      readMsg();
    }, 1000);
  }, [msgs.createdAt]);

  const getUser = async () => {
    let u = await getData('user')
    if(u != null) {
      setUser(u);
    }else{
      Toast.show('获取用户信息失败，请重新登录');
    }
  }
  const getMsg = async () => {
    let res = {};
    if(!isGroup){
      res = await getFriendMsgApi(token,fid);
    }else{
      res = await getGroupMsgApi(token,fid);
    }
    let d = res.data;
    if(d.length > 0){
      d.forEach(e => {
        if(!/^(http:\/\/|https:\/\/)/.test(e.user.avatar)){
          e.user.avatar = pre_url + '/file/preview/' + e.user.avatar;
        }
        if(e.image && !/^(http:\/\/|https:\/\/)/.test(e.image)){
          e.image = pre_url + '/file/preview/' + e.image;
        }
        if(e.audio && !/^(http:\/\/|https:\/\/)/.test(e.audio)){
          e.audio = pre_url + '/file/preview/' + e.audio;
        }
        if(e.video && !/^(http:\/\/|https:\/\/)/.test(e.video)){
          e.video = pre_url + '/file/preview/' + e.video;
        }
        if(e.text){
          e.text = e.text.replace(/\{br\}/g, "\n");
        }
      });
      setMessages(d);
    }
  };

  const readMsg = async () => {
    // 将消息设为已读
    if(!isGroup){
      const res = await readFriendMsgApi(token,fid);
      console.log(res)
    }else{
      const res = await readGroupMsgApi(token,fid);
      console.log(res)
    }
  }

  const receivedMsg = () => {
    if(Object.keys(msgs).length != 0){
      if(msgs.code){
        return;
      }
      let msg = JSON.parse(JSON.stringify(msgs));
      if(msg.user && msg.user.avatar && 
            !/^(http:\/\/|https:\/\/)/.test(msg.user.avatar)){
        msg.user.avatar = pre_url + '/file/preview/' + msg.user.avatar;
      }
      if(msg.image && !/^(http:\/\/|https:\/\/)/.test(msg.image)){
        msg.image = pre_url + '/file/preview/' + msg.image;
      }
      if(msg.audio && !/^(http:\/\/|https:\/\/)/.test(msg.audio)){
        msg.audio = pre_url + '/file/preview/' + msg.audio;
      }
      if(msg.video && !/^(http:\/\/|https:\/\/)/.test(msg.video)){
        msg.video = pre_url + '/file/preview/' + msg.video;
      }
      if(msg.text){
        msg.text = msg.text.replace(/\{br\}/g, "\n");
      }
      // TODO 在setMessages的时候去除目标子元素
      // const filteredMsgs = msgs.filter(msg => msg.text !== "...");
      setMessages((preMsg) => [msg, ...preMsg.filter(msg => msg.isBotReply != true)]);
      // setMessages((preMsg) => [msg, ...preMsg]);
    }
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor: theme.colors.background,zIndex: 1, }}>
      <View style={{flex:1}}>
        <FlatList 
          ref={flatListRef}
          data={messages}
          initialNumToRender={8}
          renderItem={({item}) => 
            <BubbleMessage 
              item={item} 
              sendUser={user} 
            />}
          keyExtractor={(_, index)=> index.toString()}
          contentContainerStyle={{
            paddingHorizontal: 10,
            gap: 10,
            paddingTop: 10,
          }}
          inverted
        />

        <ChatInput user={user} fid={fid} isGroup={isGroup} />
      </View>
    </SafeAreaView>
  );

}

export default ChatScreen;
