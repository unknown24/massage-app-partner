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
import URL from '../constants/API';

import { Image, ToastAndroid, View, AsyncStorage } from 'react-native';

export default class AnatomyExample extends Component {
  
    state = {
        email   : 'aep.stmik@gmail.com',
        password: '123456'
    } 


  async handleLogin(){
    
    const {email, password} = this.state
    const {navigate} = this.props.navigation;

    const respon = await this.validateLogin(email, password)

    if (respon.status) {
      // lempar screen

      AsyncStorage.multiSet([['login', '1'], ['pid', respon.data.id]]).then(()=>console.log('dsds'))
      navigate('Main')

    } else {
        // toast message
        ToastAndroid.show(respon.message, ToastAndroid.SHORT);
    }

  }

  async validateLogin(email, password){
    const body = new FormData()
    body.append("email", email)
    body.append("password", password)
    body.append("tipe", 'partner')
    
    let result = null
    
    result = await fetch(URL +'massage-app-server/login.php', {
                  method:'POST',
                  body  :body
              }).then(res => res.json())  

    return result
  }

  async componentDidMount(){

    const isLogin = await AsyncStorage.getItem('login')
    if (!!isLogin) {
        // ToastAndroid.show(isLogin, ToastAndroid.SHORT);
        const {navigate} = this.props.navigation
        navigate('Main')
    }
  }

  render() {
    return (
      <Container >
        <Header/>
        <Content contentContainerStyle={{ flexGrow: 1 }} >
          <View style={{height:200, justifyContent:"center", alignItems:'center'}}>
            <Image source={require('../assets/images/app-store.png')} />
          </View>
          <Form>
            <Item floatingLabel>
                <Label>Email</Label>
                <Input onChangeText={(text) => this.setState({email:text})} value={this.state.email}/>
            </Item>
            <Item floatingLabel>
                <Label>Password</Label>
                <Input secureTextEntry onChangeText={(text) => this.setState({password:text})} value={this.state.password}/>
            </Item>
            <Button onPress={this.handleLogin.bind(this)} info style={{justifyContent:'center', marginLeft:20, marginRight:20, marginTop:20}}><Text> Login </Text></Button>
          </Form>
        </Content>
      </Container>
    );
  }
}