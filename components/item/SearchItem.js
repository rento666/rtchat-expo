import React from "react";
import { StyleSheet, Text, View, Image,Pressable } from "react-native";
import { TextHighLighter } from "../text/TextHighLighter";
import { ThemeContext } from "../../navigation/ThemeProvider";

export const SearchItem = ({item,searchWord,section, navigation}) => {

  const {theme} =React.useContext(ThemeContext);

  subTxt = item.email;
  if(item.username !== undefined && item.phone !== undefined){
    subTxt +=  "     " + item.phone;
  }

  const clickedFriend = ()=> {
    if(item.isFriend){
      // 是朋友，去发送消息
      navigation.navigate('Chat', {userName: item.username, id: item.id, isGroup: false});
      return;
    }
    // 不是朋友，去添加好友
    navigation.navigate('AddFriend', {userName: item.username,id: item.id});
  }

  const clickedGroup = ()=> {
    if(item.isInGroup){
      // 在群里，去发消息
      navigation.navigate('Chat', {userName: item.name, id: item.id, isGroup: true});
    }
    // 不在群里，去添加群
  }

  if(section.title === '用户') {
    return (
      <View style={[styles.container,{backgroundColor: theme.colors.background,}]}>
        <Image style={styles.userImg} source={{uri: item.avatar}} />
        <View style={styles.wrapper}>
          <TextHighLighter title={item.username} highLightWords={[searchWord]} style={[styles.headt,{color: theme.colors.text,}]} hightLigthColor={'#298cfd'} />
          <TextHighLighter title={subTxt} highLightWords={[searchWord]} style={[styles.subt,{color: theme.colors.text,}]} />
        </View>
        <Pressable style={styles.btnWrap} onPress={clickedFriend}>
          <Text style={{color: theme.colors.primary}}>{item.isFriend ? '发送消息': '添加好友'}</Text>
        </Pressable>
      </View>
    );
  }else if(section.title === '群聊'){
    return (
      <View style={styles.container}>
        <Image style={styles.userImg} source={{uri: item.img}} />
        <View style={styles.wrapper}>
          <TextHighLighter title={item.name} highLightWords={[searchWord]} style={[styles.headt,{color: theme.colors.text,}]} hightLigthColor={'#298cfd'} />
        </View>
        <Pressable style={styles.btnWrap} onPress={clickedGroup}>
          <Text style={{color: theme.colors.primary}}>{item.isInGroup ? '发送消息': '添加群聊'}</Text>
        </Pressable>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  wrapper: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  headt: {
    fontSize: 18,
    fontWeight: '600',
  },
  subt: {
    fontWeight: '400',
  },
  btnWrap:{
    justifyContent: 'center',
  },
  
});