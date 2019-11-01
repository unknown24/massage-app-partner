import { connect } from 'react-redux';
import Login from '../../screens/LoginContainer';
import { login } from '../actions/ActionCreators';


const mapDispatchToProps = {
  onLogin: login,
};

export default connect(null, mapDispatchToProps)(Login);
