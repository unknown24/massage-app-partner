import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainTabNavigator';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../src/screens_connect/Login.con';
import SCREEN from '../constants/Screens';

export default createAppContainer(
  createSwitchNavigator({
    [SCREEN.HOME]: MainNavigator,
    Register: RegisterScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Login',
  }),
);
