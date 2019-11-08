import React from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './Login';
import SCREEN from '../constants/Screens';
import { UPDATE_CURRENT_PID } from '../constants/ActionTypes';
import { login } from '../src/actions/ActionCreators';

class LoginContainer extends React.Component {
  async componentDidMount() {
    const isLogin = await AsyncStorage.getItem('login');

    if (isLogin) {
      const { navigation } = this.props;
      const { onMounted } = this.props;
      const pid = await AsyncStorage.getItem('pid');
      onMounted(pid);
      navigation.navigate(SCREEN.DASHBOARD);
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
  onMounted: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  onLogin: login,
  onMounted: (pid) => ({ type: UPDATE_CURRENT_PID, payload: pid }),
};

export default connect(null, mapDispatchToProps)(LoginContainer);
