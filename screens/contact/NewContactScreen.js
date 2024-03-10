import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Image, FlatList } from 'react-native';
import { ThemeContext } from '../../navigation/ThemeProvider';
import { AuthContext } from '../../navigation/AuthProvider';
import { pre_url,getNewFriendListApi, refuseFriendApi, agreeFriendApi } from '../../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData } from '../../utils/storage';
import Toast from 'react-native-root-toast';

const NewContactScreen = ({navigation, route}) => {
  const {theme} = useContext(ThemeContext);
  const {token, msgs} = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const isGroup = route.params?.isGroup ?? false;
  const [uid, setUid] = useState(0);

  useEffect(() => {
    getUser();
    if(isGroup){
      console.log('新群了1！！')
    }else{
      getApplyFriend();
    }
  },[]);

  const getUser = async () => {
    const u = await getData('user')
    if(u != null) {
      setUid(u.id);
    }else{
      Toast.show('获取用户信息失败，请重新登录');
      navigation.replace('Login');
    }
  }

  const getApplyFriend = async () => {
    const res = await getNewFriendListApi(token);
    if(res.data.length > 0){
      let data = res.data;
      data.map((item) => {
        if(item.img != null && item.img != "" && !/^(http:\/\/|https:\/\/)/.test(item.img)){
          item.img = pre_url + '/file/preview/' + item.img;
        }
      })
      setContacts(data);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      { contacts.length > 0 ? <FlatList 
        showsVerticalScrollIndicator={false}
        data={contacts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <ContactItem contact={item} theme={theme} navi={() => navigation.navigate('Contact')} />
        )}
      /> : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#666'}}>暂无新朋友</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NewContactScreen;

const ContactItem = ({ contact, theme, navi }) => {

  const {token} = useContext(AuthContext);

  const leftClicked = async () => {
    const res = await refuseFriendApi(token, contact.id);
    Toast.show(res.msg, {position: Toast.positions.CENTER});
    if(res.code === 200){
      navi();
    }
  }

  const rightClicked = async () => {
    const res = await agreeFriendApi(token, contact.id);
    Toast.show(res.msg, {position: Toast.positions.CENTER});
    if(res.code === 200){
      navi();
    }
  }

  return (
    <View style={[styles.root,{ backgroundColor: theme.colors.background}]}>
      <View style={styles.itemContainer}>
        {contact.status === 1 &&
        <Pressable 
          style={styles.btnContainer}
          onPress={leftClicked}>
          <Text style={{color: theme.colors.text}}>拒绝</Text>
        </Pressable>}
        <View style={styles.infoContainer}>
          <Image style={styles.avatar} source={{uri: contact.img}} />
          <Text style={[styles.name,{color: theme.colors.text}]}>{contact.userName}</Text>
          <Text style={[{color: theme.colors.text}]}>{contact.time}</Text>
          {contact.status === 2 && (
            <View style={styles.refuse}>
              <Text style={[{color: theme.colors.accent}]}> 已拒绝 </Text>
            </View>
          )}
        </View>
        {contact.status === 1 && 
        <Pressable 
          style={[styles.btnContainer,{backgroundColor: theme.colors.primary}]}
          onPress={rightClicked}>
          <Text style={{color: theme.colors.text}}>同意</Text>
        </Pressable> }
      </View>
      <View style={[styles.subTextContainer,{background: theme.colors.placeholder}]}>
        <Text style={[{color: theme.colors.text}]}>留言：{contact.subText ? contact.subText : '空'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 5,
    borderWidth: 1,
    margin: 15,
    borderColor: '#ddd',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  btnContainer:{
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  refuse:{
    marginTop: 10,
  },
  subTextContainer:{
    margin: 10,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
  },
})