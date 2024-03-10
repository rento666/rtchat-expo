import React, { useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Ionicons, Feather as FeatherIcon,AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeProvider";

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import ChatScreen from '../screens/home/ChatScreen';
import ContactScreen from '../screens/contact/ContactScreen';
import PostScreen from '../screens/post/PostScreen';
import AddPostScreen from '../screens/post/AddPostScreen';
import CommentScreen from '../screens/post/CommentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingScreen from '../screens/profile/SettingScreen';
import AddFriendScreen from '../screens/home/AddFriendScreen';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import NewContactScreen from '../screens/contact/NewContactScreen';
import EditOne from '../screens/profile/EditOne';
import AddGroupScreen from '../screens/contact/AddGroupScreen';
import { AuthContext } from './AuthProvider';
import { getNoReadCountApi } from '../api';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MessageStack = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Messages" 
        component={HomeScreen} 
        options={{
          title: '消息',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
        }} 
      />
      <Stack.Screen 
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params.userName,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,        
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate('Messages')}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FeatherIcon
                  color={theme.colors.text}
                  name="chevron-left"
                  size={22} />
              </View>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen 
        name="AddFriend"
        component={AddFriendScreen}
        options={{
          title: '申请添加朋友',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FeatherIcon
                  color={theme.colors.text}
                  name="chevron-left"
                  size={22} />
              </View>
            </Pressable>
          ),
        }} 
      />
    </Stack.Navigator>
  )
};

const ContactStack = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='Contact'
        component={ContactScreen}
        options={{
          title: '联系人',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerRight: () => (
            <Menu>
              <MenuTrigger
                text={'+'} 
                customStyles={{
                  triggerWrapper:{
                    marginRight: 12,
                    paddingHorizontal: 5,
                  },
                  triggerText:{
                    color: theme.colors.text,
                    fontSize: 22,
                  }
                }}
              />
              <MenuOptions
                customStyles={{
                  optionsContainer:{
                    marginTop: 25,
                    width: 150,
                    marginLeft: -15,
                  },
                  optionsWrapper:{
                    padding: 10,
                  },
                  optionText: {
                    alignItems: 'center'
                  },
                }}
              >
                <MenuOption 
                  onSelect={() => navigation.navigate('AddContact')}
                  text="添加联系人"
                />
                <MenuOption 
                  onSelect={() => navigation.navigate('AddGroup')}
                  text="创建群聊"
                />
              </MenuOptions>
            </Menu>
          ),
        }}
      />
      <Stack.Screen 
        name="AddContact"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{
          title: '新的朋友',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <AntDesign 
                name="arrowleft" 
                size={22} 
                color={theme.colors.text} 
              />
            </View>
          ),
          headerRight:() => (
            <Pressable
              onPress={() => navigation.navigate('AddContact')}>
              <View style={{marginRight: 10}}>
                <Text style={{fontSize: 14, color: theme.colors.text}}>添加朋友</Text>
              </View>
            </Pressable>
          )
        }}
      />
      <Stack.Screen 
        name="AddGroup"
        component={AddGroupScreen}
        options={{
          title: '创建群聊',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <AntDesign 
                name="arrowleft" 
                size={22} 
                color={theme.colors.text} 
              />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  )
};

const PostStack = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homes"
        component={PostScreen}
        options={{
          title: '朋友圈',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('AddPost')}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FeatherIcon
                  color={theme.colors.text}
                  name="plus"
                  size={22} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <AntDesign 
                name="arrowleft" 
                size={22} 
                color={theme.colors.text} 
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Comment"
        component={CommentScreen}
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{marginLeft: 15}}>
              <AntDesign name="arrowleft" size={22} color={theme.colors.text} />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  )
};

const ProfileStack = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerTitle: '个人资料',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: theme.colors.text,
              fontSize: 18,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.navigate('Profile')}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  marginHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FeatherIcon
                    color={theme.colors.text}
                    name="chevron-left"
                    size={22} />
                </View>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            headerTitle: '设置',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: theme.colors.text,
              fontSize: 18,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.navigate('Profile')}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  marginHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FeatherIcon
                    color={theme.colors.text}
                    name="chevron-left"
                    size={22} />
                </View>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen 
          name="EditOne"
          component={EditOne}
          options={({route}) => ({
            headerTitle: '更改' + route.params?.title || '昵称',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: theme.colors.text,
              fontSize: 18,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
            },
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.navigate('Profile')}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  marginHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FeatherIcon
                    color={theme.colors.text}
                    name="chevron-left"
                    size={22} />
                </View>
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </>
  )
};

const AppStack = () => {

  const {theme, showPost} = React.useContext(ThemeContext);
  const {token,msgs} = React.useContext(AuthContext);
  const barTextColor = theme.colors.name == 'default' ? "dark" : "light";
  const [count, setCount] = React.useState(0);
  const getTabBarVisibility = (route) => {
    // 不需要tabBar的页面，填入各个Stack中的name属性即可。
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const hideOnScreens = [
      'Search','Chat','AddFriend',
      'AddContact','NewContact','AddGroup',
      'AddPost','PostChat','Comment',
      'EditProfile', 'Setting','EditOne'
    ];
    return hideOnScreens.indexOf(routeName) <= -1;
  };

  useEffect(() =>{
    if(msgs.code == 10002){
      // 有新的聊天信息需要处理
      noRead();
    }
  }, [msgs.code]);

  const noRead = async () => {
    if(!token){
      return;
    }
    const res = await getNoReadCountApi(token);
    if(res.code == 200){
      console.log('当前未读消息数量：',res.data)
      setCount(res.data);
    }
  }

  return (
    <>
      <StatusBar style={barTextColor} translucent={false} backgroundColor={theme.colors.background} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
        }}>
        <Tab.Screen
          name="Message"
          component={MessageStack}
          options={({route}) => ({
            header: ()=>null,
            tabBarLabel: '蝶语',
            tabBarBadge: `${count}`,
            tabBarBadgeStyle:{
              display: count > 0 ? 'flex' : 'none',
            },
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              display: getTabBarVisibility(route) ? 'flex' : 'none',
            },
            tabBarIcon: ({color, size}) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                color={color}
                size={size}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Contacts"
          component={ContactStack}
          options={({route}) => ({
            header: ()=>null,
            tabBarLabel: '通讯录',
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              display: getTabBarVisibility(route) ? 'flex' : 'none',
            },
            tabBarIcon: ({color, size}) => (
              <Ionicons
                name="people-outline"
                color={color}
                size={size}
              />
            ),
          })}
        />
        {showPost && 
        <Tab.Screen
          name="Post"
          component={PostStack}
          options={({route}) => ({
            header: ()=>null,
            tabBarLabel: '动态',
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              display: getTabBarVisibility(route) ? 'flex' : 'none',
            },
            tabBarIcon: ({color, size}) => (
              <Ionicons
                name="aperture-outline"
                color={color}
                size={size}
              />
            ),
          })}
        />}
        <Tab.Screen
          name="Profiles"
          component={ProfileStack}
          options={({route})=> ({
            header: ()=>null,
            tabBarLabel: '我',
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              display: getTabBarVisibility(route) ? 'flex' : 'none',
            },
            tabBarIcon: ({color, size}) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          })}
        />
      </Tab.Navigator>
    </>
  )
}
export default AppStack;
