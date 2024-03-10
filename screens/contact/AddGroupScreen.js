import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, FlatList, Pressable, Platform } from "react-native";
import { ThemeContext } from "../../navigation/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGroupApi, createGroupMembersApi, getFriendListApi,uploadFileApi, pre_url } from "../../api";
import { Feather } from "@expo/vector-icons";
import FormButton from "../../components/button/FormButton";
import MyCheckbox from "../../components/checkbox";
import { AuthContext } from "../../navigation/AuthProvider";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";

const windowWidth = Dimensions.get("window").width;

const AddGroupScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const {token} = useContext(AuthContext);
  const [img, setImg] = useState(pre_url + "/file/preview/favicon.png");
  const [friends, setFriends] = useState([]);
  const [checkeds, setCheckeds] = useState([]);
  const [name, setName] = useState("");
  const [mimeType, setMimeType] = useState('');

  useEffect(()=>{
    getfriend();
  },[]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryResponse.status !== "granted") {
          Toast.show('缺少图库权限将无法更换群头像！',{position: Toast.positions.CENTER,})
        }
      }
    })();
  },[]);

  const getfriend = async () => {
    const res = await getFriendListApi(token);
    if(res.data.length > 0){
      let data = res.data;
      let cs = [];
      data.map((item) => {
        cs[item.id] = false;
        if(item.img && !/^(http:\/\/|https:\/\/)/.test(item.img)){
          item.img = pre_url + '/file/preview/' + item.img;
        }
      })
      setCheckeds(cs);
      setFriends(data);
    }
  }

  const getCount = () => {
    return checkeds.filter((checked) => checked).length;
  }

  const selectedIndices = checkeds.reduce((acc, checked, index) => {
    if (checked) {
      acc.push(index);
    }
    return acc;
  }, []);
  
  const changeAvatar = async () => {
    // 打开相册
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setMimeType(result.assets[0].mimeType);
      setImg(result.assets[0].uri);
    }
  }

  const createGroup = async () => {
    // 创建群组
    if(!name){
      Toast.show('请输入群名称~',{position: Toast.positions.CENTER});
      return;
    }
    if(getCount() == 0){
      Toast.show('请选择至少1个好友~',{position: Toast.positions.CENTER});
      return;
    }
    let avatar = '';
    if(!mimeType){
      avatar = "favicon.png";
    }else{
      // type存在，说明需要上传图片到服务器,然后拿到url！
      const r = await uploadFileApi(token,img,mimeType);
      if(r.code != 200){
        Toast.show(r.msg,{position: Toast.positions.CENTER});
        return;
      }
      avatar = await r.data;
    }
    const res = await createGroupApi(token, name, avatar);
    Toast.show(res.msg,{position: Toast.positions.CENTER});
    if(res.data){
      createGM(res.data.id);
    }
  }

  const createGM = async (gid) => {
    const res = await createGroupMembersApi(token, gid, selectedIndices);
    setTimeout(() => {
      Toast.show(res.msg,{position: Toast.positions.CENTER});
      if(res.data){
        navigation.navigate('Contact');
      }
    }, 1000);
  }
  
  return (
    <SafeAreaView style={[styles.root, {backgroundColor: theme.colors.background}]}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{ marginVertical: 20 }}
          onPress={changeAvatar}
        >
          <Image 
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={{ uri: img }}
          />
          <View style={[styles.profileAction,{backgroundColor: theme.colors.primary}]}>
            <Feather
              color={'white'}
              name="edit-2"
              size={16} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.inputContainer,{backgroundColor: theme.colors.searchBackground}]}>
        <TextInput 
          style={[styles.input,{color: theme.colors.text}]}
          placeholder="群名称"
          placeholderTextColor={theme.colors.placeholder}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={{flex: 1,paddingHorizontal: 15, paddingVertical: 5,}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.title,{color: theme.colors.text}]}>好友</Text>
          <Text style={{color: theme.colors.placeholder, lineHeight: 30,marginLeft: 20 }}>(提示：群聊至少两个人哦~)</Text>
        </View>
        <FlatList 
          data={friends}
          renderItem={({ item }) => (
            <FriendItem friend={item} onChange={() => setCheckeds((preChecked) => {
              const newCheckeds = [...preChecked];
              newCheckeds[item.id] = !newCheckeds[item.id];
              return newCheckeds;
            })} checked={checkeds[item.id]} />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <View style={{marginHorizontal: 20, justifyContent: 'flex-end', marginBottom: 10,}}>
        <FormButton 
          buttonTitle={`创建${getCount() > 0 ? `(${getCount()}个)` : ''}`}
          onPress={() => createGroup()}
        />
      </View>
    </SafeAreaView>
  )
}

export default AddGroupScreen;

const FriendItem = ({friend, onChange, checked = false}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Pressable style={styles.row} onPress={onChange}>
      <MyCheckbox onChange={onChange} checked={checked} />
      <Image 
        style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 10,}}
        source={{ uri: friend?.img }}
      />
      <Text 
        style={{marginLeft: 10,color: theme.colors.text, maxWidth: 150}} 
        numberOfLines={1} ellipsizeMode="tail">
        {friend?.userName}
      </Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({
  root:{
    flex: 1,
    width: windowWidth,
  },
  profileAction: {
    position: 'absolute',
    right: 4,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: '#fff',
  },
  inputContainer:{
    marginHorizontal: 30,
    borderRadius: 40,
    alignItems: 'center',
  },
  input:{
    paddingHorizontal: 20,
    height: 50,
    width: '100%',
    backgroundColor: '#F6F7F9',
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  }
});