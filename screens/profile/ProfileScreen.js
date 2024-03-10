import React, { useEffect, useContext, useState } from 'react';
import {   
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { pre_url,userInfoApi} from '../../api';
import Toast from 'react-native-root-toast';
import { Feather as FeatherIcon } from '@expo/vector-icons';
import { getData, setData, setString } from '../../utils/storage';
import { ThemeContext } from '../../navigation/ThemeProvider';

const ProfileScreen = ({navigation, route}) => {

  const {theme, setTheme} = useContext(ThemeContext);
  const {token,logout, msgs} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(theme.colors.name === 'dark');

  const SECTIONS = [
    {
      header: '更多功能',
      icon: 'settings',
      items: [
        { icon: 'moon', color: theme.colors.primary, label: '暗黑模式', value: isDarkMode, type: 'boolean' },
        { icon: 'trello', color: theme.colors.primary, label: '敬请期待', type: 'link' }
      ]
    }
  ];

  const getUser = async () => {
    let res = await userInfoApi(token);
    if(res.data) {
      let u = JSON.parse(JSON.stringify(res.data));
      u.avatar = pre_url + '/file/preview/' + u.avatar;
      setUserData(u);
      setData('user',res.data);
    }else{
      Toast.show('获取用户信息失败，请重新登录');
    }
  };

  const switchTheme = (newValue) => {
    setIsDarkMode(newValue);
    if(theme.colors.name === 'dark'){
      setTheme('default');
      setString('theme', 'default');
    }else {
      setTheme('dark');
      setString('theme', 'dark');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if(msgs.code === 30008){
      getUser();
    }
  }, [msgs.code]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={[styles.container,{backgroundColor: theme.colors.background,}]}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={() => getUser()}>
          <Image
            style={styles.userImg}
            source={{uri: userData ? userData.avatar || 'https://s1.imagehub.cc/images/2023/12/23/63e1d274b2aa1b27c029f469a92fbb71.jpeg' : 'https://s1.imagehub.cc/images/2023/12/23/63e1d274b2aa1b27c029f469a92fbb71.jpeg'}}
          />
        </TouchableWithoutFeedback>
        <Text style={[styles.userName,{color: theme.colors.text,}]}>{userData ? userData.username || '用户' : '未知用户'}</Text>
        <Text style={[styles.ipAddr,{color: theme.colors.accent,}]}>
          IP归属地: {userData ? userData.addr || '未知ip' : '未知ip'}
        </Text>
        <Text style={[styles.aboutUser,{color: theme.colors.text}]}>
          {userData ? userData.about || '这个人很懒,什么都没留下.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          <TouchableOpacity
            style={[styles.userBtn,{borderColor: theme.colors.primary}]}
            onPress={() => {
              navigation.navigate('EditProfile');
            }}>
            <Text style={[styles.userBtnTxt,{color:theme.colors.text}]}>编辑资料</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userBtn,{borderColor: theme.colors.primary}]}
            onPress={() => {
              navigation.navigate('Setting');
            }}>
            <Text style={[styles.userBtnTxt,{color:theme.colors.text}]}>系统设置</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.userBtn,{borderColor: theme.colors.primary}]} onPress={() => logout()}>
            <Text style={[styles.userBtnTxt,{color:theme.colors.text}]}>退出登录</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color: theme.colors.text,}]}>{userData ? userData.accompanyDay || '0天' : '0天'}</Text>
            <Text style={[styles.userInfoSubTitle,{color: theme.colors.text}]}>陪伴您</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color: theme.colors.text,}]}>{userData ? userData.friendsCount || '0位' : '0位'}</Text>
            <Text style={[styles.userInfoSubTitle,{color: theme.colors.text}]}>好友数</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={[styles.userInfoTitle,{color: theme.colors.text,}]}>{userData ? userData.postsCount || '0条' : '0条'}</Text>
            <Text style={[styles.userInfoSubTitle,{color: theme.colors.text}]}>动态数</Text>
          </View>
        </View>
        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <Text style={[styles.sectionHeader,{color: theme.colors.placeholder}]}>{header}</Text>
            {items.map(({ label, icon, type, value, color }, index) => {

              const TouchableComponent = type === 'link' ? TouchableOpacity : TouchableWithoutFeedback

              return (
                <TouchableComponent
                  key={label}
                  onPress={() => {  }}>
                  <View style={[styles.row,{backgroundColor: theme.colors.background,}]}>
                    <View style={[styles.rowIcon, { backgroundColor: color }]}>
                      <FeatherIcon
                        color="#fff"
                        name={icon}
                        size={18} />
                    </View>

                    <Text style={[styles.rowLabel,{color:theme.colors.text}]}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === 'boolean' && <Switch value={value} onValueChange={switchTheme} />}

                    {type === 'link' && (
                      <FeatherIcon
                        color={theme.colors.primary}
                        name="chevron-right"
                        size={22} />
                    )}
                  </View>
                </TouchableComponent>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  ipAddr: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  while: {
    height: 25,
  },
  /** Section */
section: {
  width: '100%',
  paddingHorizontal: 24,
},
sectionHeader: {
  paddingVertical: 12,
  fontSize: 12,
  fontWeight: '600',
  color: '#9e9e9e',
  textTransform: 'uppercase',
  letterSpacing: 1.1,
},
/** Row */
row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 50,
  backgroundColor: '#f2f2f2',
  borderRadius: 8,
  marginBottom: 12,
  paddingLeft: 12,
  paddingRight: 12,
},
rowIcon: {
  width: 32,
  height: 32,
  borderRadius: 9999,
  marginRight: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
rowLabel: {
  fontSize: 17,
  fontWeight: '400',
  color: '#0c0c0c',
},
rowSpacer: {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
},
});
