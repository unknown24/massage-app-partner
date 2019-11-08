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

export default class AnatomyExample extends Component {
  async handleRegister() {
    const options = {
      recipients: ['aep.stmik@gmail.com'],
      subject: 'Hallo',
      body: 'tes',
    };
    const res = await MailComposer.composeAsync(options);
    console.log(res);
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input typ />
            </Item>
            <Item floatingLabel>
              <Label>No Telepon</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry />
            </Item>
            <Item floatingLabel>
              <Label>Konfirmasi Password</Label>
              <Input secureTextEntry />
            </Item>
            <Button onPress={this.handleRegister} primary style={{ justifyContent: 'center' }}><Text> Register </Text></Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
