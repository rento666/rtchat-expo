import React, {useContext,useState,useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import Toast from 'react-native-root-toast';
import { AuthContext } from '../../navigation/AuthProvider';
import FormButton from '../../components/button/FormButton';
import FormInput from '../../components/input/FormInput';
import CodeInput from '../../components/input/CodeInput';
import { codeApi } from '../../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../navigation/ThemeProvider';


const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState();
  const [codeBtn, setCodeBtn] = useState("发送");
  const [countDown, setCountDown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const {theme} = useContext(ThemeContext);
  const {register} = useContext(AuthContext);

  useEffect(()=> {
    let interval;
    if(isCounting){
      Toast.show('发送成功',{ position: Toast.positions.CENTER, });
      interval = setInterval(()=>{
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    }
    return ()=> clearInterval(interval);
  }, [isCounting]);

  useEffect(()=>{
    if (countDown === 0) {
      setCodeBtn('发送');
      setIsCounting(false);
      setCountDown(60);
    } else if (isCounting) {
      setCodeBtn(`${countDown}秒重新获取`);
    }
  }, [countDown, isCounting]);

  const isValidEmail = (email) => {
    // 正则表达式，用于匹配邮箱地址
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(email);
  };

  const sendCode = () => {
    if(isCounting){
      Toast.show('请勿重复发送验证码！',{ position: Toast.positions.CENTER,});
      return;
    }
    if(!isValidEmail(email)){
      Toast.show('无效的邮箱地址！', { position: Toast.positions.CENTER,});
      return;
    }
    setIsCounting(true);
    // 发送验证码api
    sendCodeApi(email,"email");
  };

  const sendCodeApi = async (email, e_type) => {
    const res = await codeApi(email,e_type, "注册");
    if(res.code != 200){
      Toast.show('发送失败',{ position: Toast.positions.CENTER,});
    }
  };

  const registerUser = (email, password, confirmPassword, code) => {
    if(email == null || password == null || confirmPassword == null || code == null) {
      Toast.show('请将表单填写完整',{ position: Toast.positions.CENTER,});
      return;
    }
    if(!isValidEmail(email)){
      Toast.show('无效的邮箱地址！', { position: Toast.positions.CENTER,});
      return;
    }
    if(password != confirmPassword){
      Toast.show('两次密码不一致！',{ position: Toast.positions.CENTER,});
      return;
    }
    if(codeBtn=="发送"){
      Toast.show('尚未发送验证码！',{ position: Toast.positions.CENTER,});
      return;
    }
    register(email, password, code);
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={[styles.container,{backgroundColor:theme.colors.background}]}>
        <Text style={[styles.text,{color: theme.colors.primary,}]}>创建一个新账户</Text>

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="电子邮箱"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="密码"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={(userPassword) => setConfirmPassword(userPassword)}
          placeholderText="确认密码"
          iconType="lock"
          secureTextEntry={true}
        />

        <CodeInput 
          labelValue={code}
          onChangeText={(userCode) => setCode(userCode)}
          placeholderText="验证码"
          iconType="Safety"
          buttonTitle={codeBtn}
          onPress={()=> sendCode()}
        />

        <FormButton
          buttonTitle="注册"
          onPress={() => registerUser(email, password, confirmPassword, code)}
        />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            注册即代表同意蝶语的{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              服务条款
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> 和 </Text>
          <TouchableOpacity onPress={() => alert('privacy Clicked!')}>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              隐私政策
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.navButtonText,{color: theme.colors.primary,}]}>已有账户? 前去登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    marginBottom: 20,
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
});