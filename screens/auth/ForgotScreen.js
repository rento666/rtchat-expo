import React, {useContext,useState,useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import Toast from 'react-native-root-toast';
import { AuthContext } from '../../navigation/AuthProvider';
import FormButton from '../../components/button/FormButton';
import FormInput from '../../components/input/FormInput';
import CodeInput from '../../components/input/CodeInput';
import { codeApi, forgotPwd1Api } from '../../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../navigation/ThemeProvider';


const ForgotScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState();
  const [codeBtn, setCodeBtn] = useState("发送");
  const [countDown, setCountDown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const {theme} = useContext(ThemeContext);

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
    const res = await codeApi(email,e_type, "修改密码");
    if(res.code != 200){
      Toast.show(res.msg,{ position: Toast.positions.CENTER,});
    }
  };

  const forgotUser = (email, password, code) => {
    if(email == null || password == null  || code == null) {
      Toast.show('请将表单填写完整',{ position: Toast.positions.CENTER,});
      return;
    }
    if(!isValidEmail(email)){
      Toast.show('无效的邮箱地址！', { position: Toast.positions.CENTER,});
      return;
    }
    if(codeBtn=="发送"){
      Toast.show('尚未发送验证码！',{ position: Toast.positions.CENTER,});
      return;
    }
    forgot(email, password, code);
  };

  const forgot = async (email, password, code) => {
    const res = await forgotPwd1Api(email, password, code);
    Toast.show(res.msg, {position: Toast.positions.CENTER});
    if(res.data){
      navigation.navigate('Login');
    }else {
      console.log(res.msg)
    }
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={[styles.container,{backgroundColor:theme.colors.background}]}>
        <Text style={[styles.text,{color: theme.colors.primary,}]}>重置密码</Text>

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="电子邮箱"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <CodeInput 
          labelValue={code}
          onChangeText={(userCode) => setCode(userCode)}
          placeholderText="验证码"
          iconType="Safety"
          buttonTitle={codeBtn}
          onPress={()=> sendCode()}
        />

        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="密码"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton
          buttonTitle="重设密码"
          onPress={() => forgotUser(email, password, code)}
        />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.replace('Signup')}>
          <Text style={[styles.navButtonText,{color: theme.colors.primary,}]}>没有账户? 前去注册</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ForgotScreen;

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