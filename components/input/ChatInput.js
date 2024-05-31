import React, {useState, useEffect, useRef, useContext} from "react";
import {View, BackHandler, Image,Vibration, KeyboardAvoidingView, Pressable, Keyboard, StyleSheet, TextInput, Platform} from 'react-native';
import { ThemeContext } from "../../navigation/ThemeProvider";
import { Feather,MaterialCommunityIcons,Ionicons } from "@expo/vector-icons";
import EmojiPicker from "rn-emoji-picker"
import {emojis} from "rn-emoji-picker/dist/data"
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import AudioPlayer from "../chat/AudioPlayer";
import { Audio } from "expo-av";
import ChatTool from "../chat/Tools";
import { sendMsgAudio, sendMsgText,sendMsgTextAndImage } from "../../api/websocket";
import { AuthContext } from "../../navigation/AuthProvider";
import { uploadFileApi } from "../../api";

const ChatInput = ({user, fid, isGroup}) => {
  const {theme} = useContext(ThemeContext);
  const {ws, token} = useContext(AuthContext);
  const inputRef = useRef(null);
  const [msg,setMsg] = useState('');
  const [image,setImage] = useState('');
  const [recent, setRecent] = useState([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [sound, setSound] = useState('');
  const [recording, setRecording] = useState(null); 
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [heightContainer, setHeightContainer] = useState('auto');
  const [mimeType, setMimeType] = useState('');

  const isAi = !isGroup && (fid == "1" || fid == "12");

  const resetData = () => {
    setMsg('');
    setImage('');
    setSound('');
  };

  const resetOpen = () => {
    setIsEmojiPickerOpen(false);
    setIsToolOpen(false);
    setHeightContainer('auto');
  };
  // 向操作系统请求权限
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();

        if (
          libraryResponse.status !== "granted" ||
          photoResponse.status !== "granted"
        ) {
          Toast.show('缺少相机以及图库权限将无法发送图片！',{position: Toast.positions.BOTTOM,})
        }
      }
    })();
  },[]);

  // 键盘展开、收起事件
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        // const height = event.endCoordinates.height;
        console.log('Keyboard is open');
        resetOpen();
        inputRef.current?.focus();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event) => {
        console.log('Keyboard is closed');
        inputRef.current?.blur();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // 当表情\输入框\工具栏处于打开状态时,不允许返回上一个页面
    const backAction = () => {
      if(isEmojiPickerOpen || isToolOpen || isInputOpen){
        resetOpen();
        inputRef.current?.blur();
        return true;
      }else {
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  },[isEmojiPickerOpen, isToolOpen, isInputOpen]);

  const sendMsg = () => {
    // 通过websocket来发送消息!
    let m = msg;
    if(m == null){
      return;
    }
    console.log('是不是群聊: ', isGroup);
    sendMsgText(ws,token,fid,user,m,isGroup);
    setMsg('');
    inputRef.current?.blur();
  };

  const sendSound = async () => {
    // 发送语音,首先要上传,然后将url发送!
    let s = sound;
    if(s == null){
      return;
    }
    // 上传语音,获取url
    const res = await uploadFileApi(token,s,mimeType);
    if(res.code != 200){
      Toast.show(res.msg,{position: Toast.positions.CENTER});
      return;
    }
    let uri = await res.data;
    console.log(uri);
    sendMsgAudio(ws,token,fid,user,uri,isGroup);
    setSound('');
    setMimeType('');
  };

  const sendImage = async () => {
    let i = image;
    let m = msg;
    if(i == null){
      return;
    }
    const res = await uploadFileApi(token,i,mimeType);
    if(res.code != 200){
      Toast.show(res.msg,{position: Toast.positions.CENTER});
      return;
    }
    let uri = await res.data;
    sendMsgTextAndImage(ws,token,fid,user,m,uri,isGroup);
    setImage('');
    setMimeType('');
  }

  const onImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setMimeType(result.assets[0].mimeType);
      setImage(result.assets[0].uri);
    }
  };

  const onCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setMimeType(result.assets[0].mimeType);
      setImage(result.assets[0].uri);
    }
  };

  async function onAudio() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      Vibration.vibrate(100);
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopAudio() {
    console.log("Stopping recording..");
    if (!recording) {
      return;
    }

    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    if (!uri) {
      return;
    }
    setSound(uri);
    setMimeType("audio/3gpp");
  }

  const onPlusClicked = () => {
    setIsEmojiPickerOpen(false);
    inputRef.current?.blur();
    if(isToolOpen){
      setIsToolOpen(false);
      setHeightContainer('auto');
    }else{
      setIsToolOpen(true);
      setHeightContainer('40%');
    }
  };

  const openEmoji = () => {
    inputRef.current?.blur();
    setIsToolOpen(false);
    if(isEmojiPickerOpen){
      setIsEmojiPickerOpen(false);
      setHeightContainer('auto');
    }else{
      setIsEmojiPickerOpen(true);
      setHeightContainer('50%');
    }
  }

  const onPress = () => {
    if(image){
      sendImage();
    }else if(sound){
      sendSound();
    }else if(msg){
      sendMsg();
    } else{
      onPlusClicked();
    }
  };

  const rowToolBar = () => {
    return (
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable onPress={openEmoji}>
            <Feather 
              name="smile" 
              size={28} 
              color={theme.colors.text} 
              style={styles.icon}
            />
          </Pressable>

          <TextInput
            ref={inputRef}
            style={[styles.input,{color: theme.colors.text, }]}
            placeholder="聊点什么吧..."
            placeholderTextColor={theme.colors.placeholder}
            multiline
            value={msg}
            onChangeText={setMsg}
            onFocus={() => setIsInputOpen(true)}
            onBlur={() => setIsInputOpen(false)}
          />
          { !isAi && (
            <>            
              <Pressable onPress={onImage}>
                <Feather 
                  name="image" 
                  size={28} 
                  color={theme.colors.text}
                  style={styles.icon}
                />
              </Pressable>
              <Pressable onPress={onCamera}>
                <Feather 
                  name="camera" 
                  size={28} 
                  color={theme.colors.text}
                  style={styles.icon}
                />
              </Pressable>
              <Pressable 
                onLongPress={onAudio} 
                onPressOut={stopAudio}
                delayLongPress={200}
              >
                <MaterialCommunityIcons
                  name={recording ? 'microphone' : 'microphone-outline'}
                  size={28}
                  color={recording ? 'red' : theme.colors.text}
                  style={styles.icon}
                />
              </Pressable>
            </>            
          )}

        </View>
        <Pressable 
          onPress={onPress} 
          style={[styles.buttonContainer,{backgroundColor: theme.colors.primary}]}
        >
          {msg || image || sound ? (
            <Ionicons name="send" size={20} color="white" />
          ) : (
            <Feather name="plus" size={28} color="white" />
          )}
        </Pressable>
      </View>
    );
  };

  const Emoji = () => {
    return (
      <EmojiPicker
        emojis={emojis} // emojis data source see data/emojis
        recent={recent} // store of recently used emojis
        loading={false} // spinner for if your emoji data or recent store is async
        perLine={8} // # of emoji's per line
        onSelect={(e) => {
          setMsg(msg + e.emoji);
        }} // callback when user selects emoji - returns emoji obj
        onChangeRecent={setRecent} // callback to update recent storage - arr of emoji objs
        backgroundColor={theme.colors.background} // optional custom bg color
    />
    )
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.root,
        {backgroundColor: theme.colors.background}, 
        {height: heightContainer},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {image && (
        <View style={styles.sendImageContainer}>
          <Image source={{uri: image}} style={styles.image} />
          <Pressable onPress={() => setImage(null)}>
            <Feather name="x" size={24} color={theme.colors.text} />
          </Pressable>
        </View>
      )}
      {sound && <AudioPlayer soundURI={sound} />}
      {rowToolBar()}
      {isEmojiPickerOpen && Emoji()}
      {isToolOpen && <ChatTool />}
    </KeyboardAvoidingView>
  );
}

export default ChatInput;

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  input:{
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 0,
    maxHeight: 100,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  sendImageContainer:{
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
  },
  
});