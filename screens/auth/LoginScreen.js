import React, {useContext, useState} from 'react';
import { Text, Pressable, Image, StyleSheet, ScrollView, } from 'react-native';
import FormButton from '../../components/button/FormButton';
import FormInput from '../../components/input/FormInput';
import { AuthContext } from '../../navigation/AuthProvider';
import Toast from 'react-native-root-toast';
import { ThemeContext } from '../../navigation/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {theme} = useContext(ThemeContext);
  const {login} = useContext(AuthContext);

  const loginUser = (email,password) => {
    if(email == null || password == null) {
      Toast.show('请将表单填写完整！', {position: Toast.positions.CENTER});
      return;
    }
    login(email, password)
  };

  const forget = () => {
    // TODO 忘记密码
    navigation.navigate('Forgot');
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={[styles.container,{backgroundColor: theme.colors.background}]}>
        <Image
          source={require('../../assets/favicon.png')}
          style={styles.logo}
        />
        <Text style={[styles.text, {color: theme.colors.text}]}>蝶 语</Text>

        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="邮箱"
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

        <FormButton
          buttonTitle="登录"
          onPress={() => loginUser(email, password)}
        />

        <Pressable style={styles.forgotButton} onPress={forget}>
          <Text style={[styles.navButtonText, {color:theme.colors.primary}]}>忘记密码?</Text>
        </Pressable>

        <Pressable
          style={styles.forgotButton}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.navButtonText, {color:theme.colors.primary}]}>
            没有账号? 点这里注册
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});