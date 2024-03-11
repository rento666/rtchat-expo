import React, {useContext, useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { getData } from '../utils/storage';


const Routes = () => {

  const {token} = useContext(AuthContext);
  const [user, setUser] = useState(null);

  const getU = async () => {
    let u = await getData('user')
    if(u){
      setUser(u);
    }
  }

  useEffect(()=>{
    getU();
  },[])

  return (
    <NavigationContainer>
      { token || user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;