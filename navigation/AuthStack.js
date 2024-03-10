import React, { useState,useLayoutEffect,useContext } from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotScreen from '../screens/auth/ForgotScreen';
import { AntDesign } from '@expo/vector-icons';
import { ThemeContext } from './ThemeProvider';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const AuthStack = () => {

  const {theme} = useContext(ThemeContext);
  const barTextColor = theme.colors.name == 'default' ? "dark" : "light";

  return (
    <>
      <StatusBar barStyle={barTextColor} translucent={false} backgroundColor={theme.colors.background} />
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{header: () => null}}
        />
        <Stack.Screen 
          name='Signup'
          component={RegisterScreen}
          options={({navigation}) => ({
            title: '',
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerLeft: () => (
              <View style={{marginLeft: 10}}>
                <AntDesign.Button 
                  name="arrowleft"
                  size={25}
                  backgroundColor={theme.colors.background}
                  color={theme.colors.text}
                  onPress={() => navigation.navigate('Login')}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen 
          name='Forgot'
          component={ForgotScreen}
          options={({navigation}) => ({
            title: '',
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerLeft: () => (
              <View style={{marginLeft: 10}}>
                <AntDesign.Button 
                  name="arrowleft"
                  size={25}
                  backgroundColor={theme.colors.background}
                  color={theme.colors.text}
                  onPress={() => navigation.navigate('Login')}
                />
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </>
  );
}
export default AuthStack;