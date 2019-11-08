import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LocationScreen from '../screens/DashboardContainer';
// import ReadyToGo from '../components/sub-screen/readyToGo';
import ReadyToGo from '../src/screens_connect/ReadyToGo.con';
import AccountScreen from '../screens/Account';
import SCREEN from '../constants/Screens';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    [SCREEN.DASHBOARD]: LocationScreen,
    [SCREEN.GO_TO_PELANGGAN]: ReadyToGo,
  },
  {
    initialRouteName: SCREEN.DASHBOARD,
  },
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => ( // eslint-disable-line
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';


const AccountStack = createStackNavigator({
  Account: AccountScreen,
}, config);


AccountStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => ( // eslint-disable-line
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

AccountStack.path = '';


const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config,
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => ( // eslint-disable-line
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config,
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => ( //eslint-disable-line
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  AccountStack,
});

tabNavigator.path = '';

export default tabNavigator;
