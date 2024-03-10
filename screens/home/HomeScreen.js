import React,{useState, useEffect, useContext} from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  ScrollView,
  ActivityIndicator, 
  Pressable, 
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from "../../navigation/AuthProvider";
import { ThemeContext } from "../../navigation/ThemeProvider";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import UserAvatarWithDraggableBadge from "../../components/image/Avatar";
import { msgListApi, pre_url } from "../../api";
import dateUtils from '../../utils/time';
import Toast from "react-native-root-toast";

const windowWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const {token, msgs} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [Messages,setMessages] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const getMsgList = async () => {
    setRefresh(true)
    const res = await msgListApi(token);
    if(res.code === 200){
      console.log(res.data);
      const d = JSON.parse(JSON.stringify(res.data));
      d.forEach(e => {
        e.img = pre_url + '/file/preview/' + e.img;
        e.username = e.remark && e.remark != '' ? e.remark : e.username;
        e.noReadCount = parseInt(e.noReadCount, 10);
        if(e.messageTime){
          e.messageTime = dateUtils.formatTime(e.messageTime);
        }
        if(e.noReadCount){
          console.log('好友：', e.username,'当前未读消息数：',e.noReadCount)
        }
      });
      setLoading(false);
      setRefresh(false);
      setMessages(d);
    }else{
      Toast.show(res.msg,{position: Toast.positions.CENTER});
    }
  }

  useEffect(() =>{
    getMsgList();
  }, []);

  useEffect(() => {
    if(Object.keys(msgs).length != 0){
      if(msgs.code === 10002){
        getMsgList();
      }
    }
  }, [msgs]);

  return (
    <SafeAreaView style={{flex: 1}}>
      { loading ? (
          <View style={{flex: 1,justifyContent: 'center'}}>
            <ActivityIndicator 
              size="large" 
              color={theme.colors.accent} 
            />
            <Pressable onPress={getMsgList}>
              <Text style={{textAlign: 'center',color: theme.colors.primary,marginTop: 10,}}>重新获取</Text>
            </Pressable>
          </View>
      ) : (
        <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
          <Text 
            style={[styles.search,
              {backgroundColor:theme.colors.searchBackground,
               color: theme.colors.text}]}
            onPress={()=> navigation.navigate('Search')}>
            搜索
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Messages}
            refreshing={refresh}
            onRefresh={getMsgList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => (
              <Pressable 
                style={{width: '100%'}}
                onPress={() => navigation.navigate('Chat', {userName: item.username, id: item.id, isGroup: item.isGroup})}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{paddingVertical: 15}}>
                    <UserAvatarWithDraggableBadge source={{uri:item.img}} badgeCount={item.noReadCount} isBlocked={item.isBlockMsg}  />
                  </View>
                  <View style={styles.textSection}>
                    <View style={styles.userInfoText}>
                      <Text style={[styles.username,{color:theme.colors.text}]}>{item.username}</Text>
                      <Text style={[styles.postTime,{color:theme.colors.placeholder}]}>{item.messageTime}</Text>
                    </View>
                    <View style={styles.msg}>
                      <Text style={[styles.msgText,{color:theme.colors.placeholder,maxWidth: windowWidth - 40}]} numberOfLines={1} ellipsizeMode="tail">
                        {item.messageText}
                      </Text>
                      { item.isBlockMsg && 
                        <FeatherIcon
                          style={{marginTop: 3}}
                          color={theme.colors.text}
                          name="bell-off"
                          size={14}
                        />
                      }
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  search: {
    width: '100%',
    height: 40,
    borderRadius: 3,
    marginVertical: 10,
    padding: 5,
    textAlign: 'center',
    lineHeight: 25,
  },
  textSection:{
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
  },
  msg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  msgText: {
    fontSize: 14,
  },
});