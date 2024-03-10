import React, {useContext, useState,useEffect, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { ThemeContext } from "../../navigation/ThemeProvider";
import dateUtils from "../../utils/time";
import AudioPlayer from "./AudioPlayer";
import { ResizeMode, Video } from "expo-av";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const VIDEO_CONTAINER_HEIGHT = (windowHeight*2.0) / 5.0 - 28;

const BubbleMessage = ({item, sendUser }) => {
  const {theme} = useContext(ThemeContext);
  const [time, setTime] = useState('');
  const videoRef = useRef(null);
  const [status, setStatus] = useState(''); // 视频播放状态
  const [videoWidth, setVideoWidth] = useState(200); // 视频宽度
  const [videoHeight, setVideoHeight] = useState(VIDEO_CONTAINER_HEIGHT); // 视频高度
  
  const isSelf = item.user && sendUser && item.user._id === sendUser.id.toString();
  const flexDirection = isSelf ? "row-reverse" : "row";
  const backgroundColor = item.system ? "transparent" : (isSelf ? theme.colors.primary : theme.colors.searchBackground);
  const alignSelf =  item.system ? "center" : (isSelf ? "flex-end" : "flex-start");
  const fontSize = item.system ? 12 : 16;
  const color = theme.colors.text;
  const textAlign = isSelf ? "right" : "left";

  const getTime = () => {
    if(item.createdAt){
      const t = dateUtils.formatTime(item.createdAt);
      setTime(t);
    }
  };

  const getVideoDisplay = (event) => {
    const widestHeight = 
      (windowWidth * event.naturalSize.height) / event.naturalSize.width;
    if(widestHeight > VIDEO_CONTAINER_HEIGHT){
      setVideoWidth(
        (VIDEO_CONTAINER_HEIGHT* event.naturalSize.width) / event.naturalSize.height
      );
      setVideoHeight(VIDEO_CONTAINER_HEIGHT);
    }else {
      setVideoWidth(windowWidth);
      setVideoHeight(
        (DEVICE_WIDTH * event.naturalSize.height) / event.naturalSize.width
      )
    }
  }

  useEffect(() => {
    getTime();
  }, [item.createdAt]);

  return (
    <View style={[styles.container, {alignSelf: alignSelf,flexDirection: flexDirection,}]}>
      {/* 非系统消息 */}
      {!item.system && item.user && item.user.avatar &&
        <Pressable>
          <Image 
            style={styles.avatar} 
            source={{uri: item.user.avatar}} 
          />
        </Pressable>
      }
      <View>
        {/* 昵称 */}
        {item.isGroup && !item.system && 
          <Text style={[styles.username,{color: theme.colors.textsub, textAlign: textAlign}]}>
            {item.user.name}
          </Text>
        }
        {/* 气泡框 */}
        <View style={[styles.textView,{backgroundColor: backgroundColor,width: item.audio ? (windowWidth * 0.7) : 'auto'}]}>
          {item.text && <Text style={{ fontSize: fontSize, color: color,}}>{item.text}</Text>}
          {item.image && 
          <Pressable>
            <Image 
              style={styles.image} 
              source={{uri: item.image}} 
            />
          </Pressable>
          }
          {item.audio && <AudioPlayer soundURI={item.audio} />}
          {item.video && (
            <View style={[styles.videoContainer,]}>
              <Video 
                ref={videoRef}
                style={[styles.video,{width: videoWidth, height: videoHeight}]}
                source={{ uri: item.video }}
                useNativeControls={true}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={true}
                onReadyForDisplay={getVideoDisplay}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
            </View>
          )}
          {time && !item.system && 
            <Text style={[styles.time,{textAlign: textAlign,color: color,}]}>
              {time}
            </Text>
          }
        </View>
      </View>
    </View>
  )

}
export default BubbleMessage;

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    alignItems: 'flex-start',
  },
  textView:{
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 15,
  },
  username: {
    fontSize: 10,
    marginHorizontal: 5,
    marginBottom: 2,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 30,
  },
  image: {
    marginTop: 5,
    width: 200,
    height: 200,
  },
  time:{
    marginTop: 5,
    fontSize: 10,
  },
  videoContainer:{
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: windowWidth,
    minWidth: 200,
  }
});