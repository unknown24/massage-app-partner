import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainTabNavigator'
import RegisterScreen from '../screens/Register'
import LoginScreen from '../screens/Login'

export default createAppContainer(
  createSwitchNavigator({
    Main    : MainNavigator,
    Register: RegisterScreen,
    Login   : LoginScreen
  },
  {
    initialRouteName: 'Login',
  })
);
