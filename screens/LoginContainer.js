import React from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import Login from './Login';
import SCREEN from '../constants/Screens';

class LoginContainer extends React.Component {
  async componentDidMount() {
    const isLogin = await AsyncStorage.getItem('login');
    if (isLogin) {
      const { navigation } = this.props;
      navigation.navigate(SCREEN.HOME);
    }
  }

  render() {
    return <Login {...this.props}/>; // eslint-disable-line
  }
}

LoginContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default LoginContainer;
