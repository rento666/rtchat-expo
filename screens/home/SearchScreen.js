import React,{useState,useEffect,useContext} from "react";
import { StyleSheet, Text, View, FlatList,SectionList } from "react-native";
import { SearchInput } from "../../components/input/SearchInput";
import { SearchItem } from "../../components/item/SearchItem";
import {AuthContext} from "../../navigation/AuthProvider";
import { ThemeContext } from "../../navigation/ThemeProvider";
import { pre_url, searchApi } from "../../api";
import Toast from "react-native-root-toast";

const SearchScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const {token,} = useContext(AuthContext);
  const [search, setSeatch] = useState("");
  const [sections, setSections] = useState([]);
  const [hasData, setHasData] = useState(false);

  const getSearch = async () => {
    if(search == ""){
      return;
    }
    if(search === 'rtChat'){
      Toast.show('恭喜您触发彩蛋~🎉🎉', {position: Toast.positions.CENTER});
    }
    const res = await searchApi(token, search);
    if(res.code != 200) {
      Toast.show(res.msg, {position: Toast.positions.CENTER});
      return;
    }
    let data = res.data;
    if(data == null || (data.users.length == 0 && data.groups.length == 0)){
      setHasData(false);
      return;
    }
    setHasData(true);
    data.users.forEach(e => {
      if(!containsHttp(e.avatar)){
        e.avatar = pre_url + '/file/preview/' + e.avatar;
      }
    });
    data.groups.forEach(e => {
      if(!containsHttp(e.img)){
        e.img = pre_url + '/file/preview/' + e.img;
      }
    });
    let s = [
      {title: "用户", data: data.users},
      {title: "群聊", data: data.groups},
    ]
    setSections(s);
  };

  const containsHttp = (str) => {
    const regex = /http/;
    return regex.test(str);
  };
  
  // 每次search有变化时执行此方法
  useEffect(()=> {
    getSearch();
  },[search]);

  const renderSectionHeader = ({ section: { title,data } }) => {
    return (
      <View>
        <Text style={[styles.sectionHeader,{color: theme.colors.text}]}>{title}</Text>
        {data && data.length === 0 && <View style={styles.container}><Text style={{color: theme.colors.text,}}>暂无数据</Text></View>}
      </View>
    );
  }

  return (
    <>
     <SearchInput
       labelValue={search}
       onChangeText={(search) => setSeatch(search)}
       cannel={() => navigation.goBack()}
       placeholderText="🔍找人/群"
     />
     {
       search === '' ? (
         <View style={[styles.container,{backgroundColor: theme.colors.background,}]}>
           <Text style={{color: theme.colors.text,}}>可以搜索系统内的全部用户和群组！</Text>
           <Text style={{color: theme.colors.text,}}>快来试一试吧！</Text>
         </View>
       ) : (
         <>
           {hasData ? (
              <SectionList
                sections={sections}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={renderSectionHeader}
                renderItem={({ item,index,section }) => <SearchItem item={item} searchWord={search} section={section} navigation={navigation}  />}
              />
            ): (
              <View style={[styles.container,{backgroundColor: theme.colors.background,}]}>
                <Text style={{color: theme.colors.text,}}>暂时找不到哦！</Text>
              </View>
            )}
         </>
       )
     }
    </>
   );

}

export default SearchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    margin: 10,
    fontSize: 18,
    fontWeight: '600',
  }
});