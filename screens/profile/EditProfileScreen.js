import React, { useState,useContext, useEffect, useRef } from 'react';
import { 
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  TouchableWithoutFeedback,
  Switch,
  FlatList,
} from 'react-native';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import { ThemeContext } from '../../navigation/ThemeProvider';
import { getData } from '../../utils/storage';
import { pre_url } from '../../api';
import Toast from "react-native-root-toast";
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from '../../navigation/AuthProvider';
import {uploadFileApi, updateUserApi } from '../../api';

const SECTIONS = [
  {
    header: '基本信息',
    items: [
      { label: '昵称', icon: 'user', type: 'input', value: '无', handler: () => {}},
      { label: '简介', icon: 'edit-2', type: 'link', handler: () => {}},
      { label: '密码', icon: 'lock', type: 'link', handler: () => {}}
    ],
  },
  {
    header: '联系方式 & 登录方式',
    items: [
      { label: '蝶语号', icon: 'user', type: 'input', value: '无', handler: () => {}},
      { label: '手机号', icon: 'phone', type: 'input', value: '无', handler: () => {}},
      { label: '邮箱号', icon: 'email', type: 'input', value: '无', handler: () => {}},
    ],
  }
];

const EditProfileScreen = ({navigation}) => {

  const {theme} = useContext(ThemeContext);
  const {token} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [sections, setSections] = useState(SECTIONS);
  const [img, setImg] = useState(userData?.avatar);
  const [mimeType, setMimeType] = useState('');

  useEffect(() => {
    getUser();
  },[]);

  const getUser = async () => {
    let u = await getData('user');
    if(u){
      u.avatar =  pre_url + '/file/preview/' + u.avatar;
      setUserData(u);
      setImg(u.avatar);
      setSections((prevSections) => {
        return prevSections.map(section => {
          return {
            ...section,
            items: section.items.map(item => {
              if(item.label == '昵称'){
                return { ...item, value: u.username, handler: () => {navigation.navigate('EditOne',{title: '昵称', content: u.username})}}
              }else if(item.label == '简介'){
                return {...item, handler: () => {
                  navigation.navigate('EditOne',{title: '简介', content: u.about})
                }}
              }else if(item.label == '密码'){
                // TODO 跳转到忘记密码！
                return {...item}
              }else if(item.label == '蝶语号'){
                return {...item, value: u.number, handler: () => {
                  const valueToCopy = u.number; // 获取当前项的value
                  Clipboard.setStringAsync(valueToCopy);
                  Toast.show('复制成功', {position: Toast.positions.CENTER, duration: 1000});
                }}
              }else if(item.label == '手机号'){
                return {...item, value: u.phone, handler: () => {
                  navigation.navigate('EditOne',{title: '手机号', content: u.phone})
                }}
              }else if(item.label == '邮箱号'){
                return {...item, value: u.email, handler: () => {
                  navigation.navigate('EditOne',{title: '邮箱号', content: u.email})
                }}
              }
            })
          }
        })
      })
    }else{
      Toast.show('获取用户信息失败',{position: Toast.positions.CENTER,});
      navigation.replace('Login');
    }
  }

  const changeAvatar = async () => {
    // 打开相册
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setMimeType(result.assets[0].mimeType);
      setImg(result.assets[0].uri);

      // type存在，说明需要上传图片到服务器,然后拿到url！
      const r = await uploadFileApi(token,result.assets[0].uri,result.assets[0].mimeType);
      if(r.code != 200){
        Toast.show(r.msg,{position: Toast.positions.CENTER});
        return;
      }
      console.log(r.data);
      let avatar =  await r.data;

      const res = await updateUserApi(token, avatar, 'avatar');
      console.log(res);
      Toast.show(res.msg,{position: Toast.positions.CENTER});
    }
  }
  
  return (
    <SafeAreaView style={[{flex: 1,backgroundColor: theme.colors.background,}]}>
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity
            onPress={() => {
              changeAvatar();
            }}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt=""
                source={{ uri: img}}
                style={styles.profileAvatar} />

              <View style={styles.profileAction}>
                <FeatherIcon
                  color="#000"
                  name="edit-2"
                  size={12} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <GroupedList
          SECTIONS={sections}
        />

      </ScrollView>
    </SafeAreaView>
  );
}
export default EditProfileScreen;

const GroupedList = ({ SECTIONS = [], switchClick = ()=>{} }) => {
  const {theme,} = React.useContext(ThemeContext);
  return (
    <View>
      {SECTIONS.map(({ header, items }) => (
        <View style={styles.section} key={header}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{header}</Text>
          </View>
          <View style={styles.sectionBody}>
            {items.map(({ label, type, value, handler }, index) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;
              const TouchableComponent = type === 'boolean' ?  TouchableWithoutFeedback : TouchableOpacity;
              return (
                <View
                  key={label}
                  style={[
                    styles.rowWrapper,
                    index === 0 && { borderTopWidth: 0 },
                    isFirst && styles.rowFirst,
                    isLast && styles.rowLast,
                    {backgroundColor:theme.colors.background,borderColor: theme.colors.placeholder},
                  ]}>
                  <TouchableComponent
                    onPress={() => handler() }>
                    <View style={[styles.row,]}>
                      <Text style={[styles.rowLabel,{color:theme.colors.text}]}>{label}</Text>

                      <View style={styles.rowSpacer} />

                      {type === 'input' && (
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.rowValue,{color:theme.colors.placeholder}]}>{value}</Text>
                      )}

                      {type === 'boolean' && <Switch value={value} onValueChange={switchClick} />}

                      {(type === 'input' || type === 'link') && (
                        <FeatherIcon
                          color={theme.colors.text}
                          name="chevron-right"
                          size={22} />
                      )}
                    </View>
                  </TouchableComponent>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 48,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Profile */
  profile: {
    padding: 24,
    // backgroundColor: '#333',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: 4,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: '#fff',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  /** Section */
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    padding: 8,
    paddingLeft: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#adadad',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 0,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabel: {
    fontSize: 17,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    maxWidth: 150,
    overflow: 'hidden',
    fontSize: 17,
    color: '#ababab',
  },
});