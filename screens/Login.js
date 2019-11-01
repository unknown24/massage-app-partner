import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Button,
  Text,
  Label,
} from 'native-base';

import {
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { atoms, utilities, molecul } from '../styles';


const logo = require('../assets/images/app-store.png');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'aep.stmik@gmail.com',
      password: '123456',
    };
  }

  handleLogin = async () => {
    const { email, password } = this.state;
    const { onLogin } = this.props;
    onLogin({ email, password });
  }

  render() {
    const { email, password } = this.state;

    return (
      <Container>
        <Header />
        <Content contentContainerStyle={utilities.flexFull}>
          <View style={molecul.LogoContainer}>
            <Image source={logo} />
          </View>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={(text) => this.setState({ email: text })} value={email} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                onChangeText={(text) => this.setState({ password: text })}
                value={password}
              />
            </Item>
            <Button
              onPress={this.handleLogin}
              info
              style={atoms.primary_button}
            >
              <Text> Login </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
