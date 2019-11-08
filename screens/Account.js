import React, { Component } from 'react';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Right,
  Form,
  Item,
  Input,
  Button,
  Text,
  Label,
} from 'native-base';

import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import withAuth from '../library/hoc/withAuth';
import Colors from '../constants/Colors';


class Akun extends Component {
  static navigationOptions = {
    header: null,
  }

  logOut() {
    this.props.logOut('Login');
  }

  render() {
    return (
      <Container>
        <Header />
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>

            <Ionicons
              name="md-contact"
              size={100}
              color={Colors.tabIconDefault}
            />
            <Text> Aep Saepudin </Text>
            <Text> 0895-3422-1234-2</Text>

          </View>
          <Card style={{ marginLeft: 10, marginRight: 10 }}>
            <CardItem button onPress={this.logOut.bind(this)}>
              <Body>
                <Text>
                    Sign Out
                </Text>
              </Body>
              <Right>
                <Ionicons
                  name="md-log-out"
                  size={27}
                  color={Colors.tabIconDefault}
                />
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}


export default withAuth(Akun);
