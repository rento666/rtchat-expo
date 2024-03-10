import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import { ThemeContext } from "../../navigation/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import LabelSheet from "../../components/bottom/Label";
import FormButton from '../../components/button/FormButton'
import { applyFriendApi } from "../../api";
import { AuthContext } from "../../navigation/AuthProvider";
import Toast from "react-native-root-toast";

const AddFriendScreen = ({navigation, route}) => {
  const {theme}  = useContext(ThemeContext);
  const {token} = useContext(AuthContext);
  const name = route.params.userName;
  const fid = route.params.id;
  const [content, setApplyText] = useState("你好，我是");
  const [remark, setReamrk] = useState(name);
  const [label, setLabel] = useState('');
  const sheet = useRef(null);

  const onLabelClicked = () => {
    sheet.current?.show();
  }

  const onSubmit = async () => {
    console.log('applytext: ', content, 'remark: ',remark, 'label: ', label);
    const res = await applyFriendApi(token, fid, content, remark, label);
    console.log('res: ', res);
    Toast.show(res.msg, {position: Toast.positions.CENTER});
    if(res.code === 200){
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={[styles.root,{backgroundColor: theme.colors.background}]}>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.header}>申请信息</Text>
          <TextInput 
            style={[styles.row,{backgroundColor: theme.colors.searchBackground}]}
            value={content}
            placeholder="对方会看到的申请信息哦"
            onChangeText={setApplyText}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.header}>备注</Text>
          <TextInput 
            style={[styles.row,{backgroundColor: theme.colors.searchBackground}]}
            placeholder={name}
            onChangeText={setReamrk}
          />
        </View>
        <Pressable style={styles.container} onPress={onLabelClicked}>
          <Text style={styles.header}>添加标签</Text>
          <View 
            style={[styles.row,styles.button,
            {backgroundColor: theme.colors.searchBackground}]}>
            <Text style={{fontSize: 18, color: theme.colors.text}}>标签</Text>
            <View style={{flexDirection: 'row'}}>
              {label && <Text style={{ color: theme.colors.text, marginRight: 10,}}>{label}</Text>}
              <AntDesign name="right" size={20} color="#999" />
            </View>
          </View>
        </Pressable>
      </View>
      <View style={styles.applyContainer}>
        <FormButton
          buttonTitle="申请"
          onPress={onSubmit}
        />
      </View>
      <LabelSheet sheet={sheet} onButton={setLabel} />
    </SafeAreaView>
  )
}

export default AddFriendScreen;

const styles = StyleSheet.create({
  root: {
    flex:1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: 'column'
  },
  header: {
    fontSize: 14,
    color: '#808080',
    marginHorizontal: 20,
  },
  row:{
    height: 60,
    padding: 15,
    margin: 10,
    fontSize: 18,
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyContainer: {
    marginHorizontal: 10,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
})