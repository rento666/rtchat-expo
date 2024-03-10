import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormButton from '../../components/button/FormButton';
import { ThemeContext } from '../../navigation/ThemeProvider';
import Toast from 'react-native-root-toast';
import { updateUserApi } from '../../api';
import { AuthContext } from '../../navigation/AuthProvider';

const EditOne = ({navigation, route}) => {
  const {theme} = useContext(ThemeContext);
  const {token} = useContext(AuthContext);
  const title = route.params?.title || '昵称';
  const [content, setContent] = useState(route.params?.content || '');

  handleSave = () => {
    // 保存内容的逻辑
    if (title === '昵称') {
      if (content.length <= 14) {
        updateUsername();
      } else {
        Toast.show('昵称不能超过14个字', { position: Toast.positions.CENTER });
      }
    } else if (title === '简介') {
      if (content.length <= 80) {
        updateAbout();
      } else {
        Toast.show('简介不能超过80个字', { position: Toast.positions.CENTER });
      }
    } else if (title === '手机号') {
      if (isValidPhoneNumber(content)) {
        updatePhone();
      } else {
        Toast.show('请输入有效的手机号', { position: Toast.positions.CENTER });
      }
    } else if (title === '邮箱号') {
      if (isValidEmail(content)) {
        updateEmail();
      } else {
        Toast.show('请输入有效的邮箱地址', { position: Toast.positions.CENTER });
      }
    } else {
      Toast.show('当前页面有误，请重新进入！', { position: Toast.positions.CENTER });
    }
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^1[3456789]\d{9}$/;
    return phoneNumberRegex.test(phoneNumber);
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };
  
  const updateUsername = async () => {
    const res = await updateUserApi(token, content, 'username');
    if(res.data){
      navigation.navigate('Profile');
    }
    Toast.show(res.msg,{position: Toast.positions.CENTER})
  }

  const updateAbout = async () => {
    const res = await updateUserApi(token, content, 'about');
    if(res.data){
      navigation.navigate('Profile');
    }
    Toast.show(res.msg,{position: Toast.positions.CENTER})
  }

  const updatePhone = async () => {
    const res = await updateUserApi(token, content, 'phone');
    if(res.data){
      navigation.navigate('Profile');
    }
    Toast.show(res.msg,{position: Toast.positions.CENTER})
  }

  const updateEmail = async () => {
    const res = await updateUserApi(token, content, 'email');
    if(res.data){
      navigation.navigate('Profile');
    }
    Toast.show(res.msg,{position: Toast.positions.CENTER})
  }

  return (
    <SafeAreaView style={styles.root}>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder={`请输入要修改的${title}`}
        placeholderTextColor={theme.colors.placeholder}
        multiline={true}
      />
      <View style={styles.submit}>
        <FormButton 
          buttonTitle={'保存'} 
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}

export default EditOne;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 100,
  },
  input: {
    minHeight: 80,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  submit: {
    margin: 10,
  }
});