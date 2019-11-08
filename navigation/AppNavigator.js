import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainTabNavigator';
import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/LoginContainer';
import SCREEN from '../constants/Screens';

export default createAppContainer(
  createSwitchNavigator({
    [SCREEN.DASHBOARD]: MainNavigator,
    Register: RegisterScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Login',
  }),
);
