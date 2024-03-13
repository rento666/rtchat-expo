import React, {useContext, useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { getData } from '../utils/storage';


const Routes = () => {

  const {token} = useContext(AuthContext);
  var u;

  const getU = async () => {
    u = await getData('user')
  }

  useEffect(()=>{
    getU();
  },[])

  return (
    <NavigationContainer>
      { token || u ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;