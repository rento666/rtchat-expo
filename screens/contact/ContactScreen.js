import React, { useContext, useState,useMemo, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ThemeContext } from "../../navigation/ThemeProvider";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AuthContext } from "../../navigation/AuthProvider";
import { pre_url,getFriendListApi,getGroupListApi, getNewFriendCountApi } from "../../api";
import Toast from "react-native-root-toast";

const items = [
  { key: 'friends', title: '好友' },
  { key: 'groups', title: '群聊' },
];

const ContactScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const {token, msgs} = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newFCount, setNewFCount] = useState(0); // 新朋友个数

  useEffect(() => {
    getlist();
    getFriendCount();
  }, []);

  useEffect(()=> {
    if(msgs.code === 20006){
      getlist();
      getFriendCount();
    }
  }, [msgs]);

  const getlist = () => {
    getfriend();
    getgroup();
  }

  const getfriend = async () => {
    const res = await getFriendListApi(token);
    if(res.data.length > 0){
      let data = res.data;
      data.map((item) => {
        if(item.img != null && item.img != "" && !/^(http:\/\/|https:\/\/)/.test(item.img)){
          item.img = pre_url + '/file/preview/' + item.img;
        }
      })
      setFriends(data);
    }
  }

  const getgroup = async () => {
    const res = await getGroupListApi(token);
    if(res.data.length > 0){
      let data = res.data;
      data.map((item) => {
        if(item.img != null && item.img != "" && !/^(http:\/\/|https:\/\/)/.test(item.img)){
          item.img = pre_url + '/file/preview/' + item.img;
        }
      })
      setGroups(data);
    }
  }

  const getFriendCount = async () => {
    const res = await getNewFriendCountApi(token);
    if(res.data > 0){
      setNewFCount(res.data);
    }
  }

  const renderScene = SceneMap({
    friends: () => <Contact item={friends} />,
    groups: () => <Contact item={groups} totalName='群聊' />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      labelStyle={{ textAlign: 'center', color: theme.colors.text }}
      indicatorStyle={{ backgroundColor: '#F26463' }}
      style={{ backgroundColor: theme.colors.background }}
    />
  );

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={[styles.newContacts,{backgroundColor: theme.colors.background}]}>
        <Pressable style={styles.iconContainer} onPress={() => navigation.navigate('NewContact')}>
          <Text style={[styles.email,{color: theme.colors.text}]}>新朋友</Text>
          <View style={{flexDirection: 'row'}}>
            {newFCount > 0 && <Text style={styles.count}>{newFCount}</Text>}
            <AntDesign name='right' size={18} color={theme.colors.placeholder} />
          </View>
        </Pressable>
        <Pressable style={styles.iconContainer} onPress={() => {
          // navigation.navigate('NewContact',{isGroup: true})
          Toast.show('敬请期待',{position: Toast.positions.CENTER})
        }}>
          <Text style={[styles.email,{color: theme.colors.text}]}>群通知</Text>
          <AntDesign name='right' size={18} color={theme.colors.placeholder} />
        </Pressable>
      </View>
      <TabView
        navigationState={{ index, routes: items }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );

}

export default ContactScreen;


const Contact = ({item, totalName = '朋友'}) => {
  const {theme} = useContext(ThemeContext);

  const sections = useMemo(() => {
    // 使用reduce对item进行处理，生成按首字母分组的数据结构
    const sectionsMap = item.reduce((acc, item) => {
      // // 将姓名按空格拆分，获取姓氏的首字母（最后一个单词的首字母）
      // const [lastName] = item.name.split(' ').reverse();
      // 将姓名按空格拆分，获取姓氏的首字母
      const [firstName] = item.name.split(' ');
      // 将联系人按照首字母分组，形成一个对象
      return Object.assign(acc, {
        [firstName[0]]: [...(acc[firstName[0]] || []), item],
      });
    }, {});
    // 将对象转换为数组，并按照字母顺序排序
    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {sections.map(({ letter, items }) => (
          <View style={styles.section} key={letter}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>{letter}</Text>
            <View style={styles.sectionItems}>
              {items.map(({ img, userName, email }, index) => {
                return (
                  <View key={index} style={styles.cardWrapper}>
                    <Pressable
                      onPress={() => {
                        // handle onPress
                      }}>
                      <View style={styles.card}>
                        {img ? (
                          <Image
                            alt=""
                            resizeMode="cover"
                            source={{ uri: img }}
                            style={styles.cardImg} />
                        ) : (
                          <View style={[styles.cardImg, styles.cardAvatar]}>
                            <Text style={[styles.cardAvatarText, {color: theme.colors.text}]}>{userName[0]}</Text>
                          </View>
                        )}

                        <View style={styles.cardBody}>
                          <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{userName}</Text>

                          {email && <Text style={[styles.cardEmail,{color: theme.colors.textsub}]}>{email}</Text>}
                        </View>

                        <View style={styles.cardAction}>
                          <Feather
                            color="#9ca3af"
                            name="chevron-right"
                            size={22} />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        
        {
          item.length > 0 ? 
          <View style={styles.footer}>
            <Text style={[styles.foot, {color: theme.colors.text}]}>{item.length}个{totalName}</Text>
          </View>
          : (
            <View style={{flex:1,alignItems: 'center', justifyContent: 'center'}}>
              <Text>暂无</Text>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 5,
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Section */
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionItems: {
    marginTop: 8,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 6,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardEmail: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  footer: {
    alignItems: 'center',
  },
  foot: {
    marginTop: 18,
    fontWeight: '400',
  },
  cardAction: {
    paddingRight: 16,
  },
  newContacts:{
    paddingHorizontal: 15,
  },
  iconContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingVertical: 5,
  },
  count: {
    marginRight: 10,
    paddingHorizontal: 5,
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 10,
  },
});