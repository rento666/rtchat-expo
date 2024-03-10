import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';


const Routes = () => {

  const {token} = useContext(AuthContext);

  return (
    <NavigationContainer>
      { token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;