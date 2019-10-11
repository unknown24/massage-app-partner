import React, { Component } from 'react';
import { Platform, View, Switch, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import queryString from 'query-string'
import { Container, Header, Content, Card, CardItem, Text, Right, Body } from 'native-base';
import Dialog from "react-native-dialog";
import Image from 'react-native-remote-svg';
import baseURL from '../constants/API'

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);


import { getLastString } from '../library/String'
import initApp from '../library/firebase/firebase';

const firebase   = initApp()
const dbh        = firebase.firestore();
const TASK       = 'update-position'
const TIMER      = 20

function saySuccess(){
  console.info("Document successfully");
}


function sayError(error){
  console.error("Error operation document: ", error);
}

export default class App extends Component {
  static navigationOptions = {
    header: null,
  }
  
  state = {
    currentPesanan: {
      id_pesanan: null,
      lokasi    : null,
      user_id   : null
    },
    dialogVisible: false,
    location     : null,
    errorMessage : null,
    switch       : false,
    task         : {},
    timer        : TIMER,
    pid          : 0
  };


  UNSAFE_componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
          this.setState({
              errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  

    async componentDidMount(){

       this._getAllTask()
       const pid = await this._getPID()
       this._listenToPesanan(pid,this)
       this._listenToClient(pid,this)
    }

    async _getPID() {
      const pid        = await AsyncStorage.getItem("pid")
      this.setState({pid})
      return pid
    }

    _listenToClient(pid, that){

      dbh.collection("pesananClient").where("partner_id", "==", pid)
      .onSnapshot(function(querySnapshot) {
        querySnapshot.docChanges().forEach(function(change) {
          
          if (change.type === "added") {
              var pesanan = [];
              querySnapshot.forEach(function(doc) {

                pesanan.push({
                  partner_id: doc.data().partner_id,
                  user_id   : doc.data().user_id,
                  status    : doc.data().status,
                  payment   : doc.data().payment
                })

              })

              if (pesanan.length > 0) {
                that.props.navigation.navigate('Ready', {
                  tipe: pesanan[0].payment == 'bank_transfer' ? 'waiting' : 'ready',
                })
                  
              } else {
                console.log('Tidak ada pesanan')
              }
          }

        })
    })      
    }


    _listenToPesanan(pid, that){
      dbh.collection("pesanan").where("partner_id", "==", pid)
        .onSnapshot(function(querySnapshot) {
          querySnapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                var pesanan = [];
                querySnapshot.forEach(function(doc) {

                  pesanan.push({
                    id_pesanan: getLastString(doc._document.proto.name),
                    user_id   : doc.data().user_id,
                    lokasi    : doc.data().user_location,
                    payment   : doc.data().payment
                  })

                })

                if (pesanan.length > 0) {
                  console.log(pesanan)
                  that.setState({
                      currentPesanan: pesanan[0],
                      dialogVisible : true
                  })

                  let i = TIMER
                  that.interval = setInterval(function(){
                    if(i==0){
                      that._tolakPesanan()
                    }
                    that.setState({timer:i})
                    i--
                  },1000)

                    
                } else {
                  console.log('Tidak ada pesanan')
                }
            }
          })
      })

    }


    async _getAllTask(){
      this.allTask = await TaskManager.getRegisteredTasksAsync()
      this.updateLocationTask = this.allTask.filter(task=>task.taskName == TASK)
      if (this.updateLocationTask.length){
        this.setState({
          task  : this.updateLocationTask[0],
          switch: true
        })
      } else {
        this.setState({
          task  : {taskName:'none'},
          switch: false
        })
      }
    }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  }

  

  async handleToogle(){
    
    await this.setState({switch:!this.state.switch})
    const updateLocationTask = this.updateLocationTask

    if (this.state.switch) {
      await Location.startLocationUpdatesAsync(TASK, {
        accuracy: Location.Accuracy.High,
      });
      this._getAllTask()

    } else {
        if(updateLocationTask.length){
          TaskManager.unregisterTaskAsync(TASK)
          dbh.collection('activePartner').doc(this.state.pid).delete()
          this._getAllTask()
        }
    }

  }

  _terimaPesanan(){
    clearInterval(this.interval)
    const params = {
      user_id   : this.state.currentPesanan.user_id,
      partner_id: this.state.pid,
      payment   : this.state.currentPesanan.payment,
      id_pesanan: this.state.currentPesanan.id_pesanan,
    }

    const stringified = queryString.stringify(params)
    
    fetch(baseURL +'massage-app-server/acceptOrder.php?' + stringified)
      .then(res=>{
        
        try {
          const json = res.json()
          return json
        } catch (error) {
          return res.text()
        }

      }).then(()=> {
        this.setState({dialogVisible:false})
      })
  }

  _tolakPesanan(){
    clearInterval(this.interval)
    const params = {
      user_id   : this.state.currentPesanan.user_id,
      latitude  : this.state.currentPesanan.lokasi._lat,
      longitude : this.state.currentPesanan.lokasi._long,
      skipped   : this.state.pid,
      id_pesanan: this.state.currentPesanan.id_pesanan,
    }
    const stringified = queryString.stringify(params)
    fetch(baseURL + 'massage-app-server/order.php?' + stringified)
      .then(res=>{

        try {
          return res.json()
        } catch (error) {
          console.log(error)
          return res.text()
        }
        
      }).then(()=> {
        this.setState({dialogVisible:false})
      })
  }
  
  render() {
    const title = `Ada Pesanan (${this.state.timer})`
    
    let statusImage, statusText 

    if (this.state.switch) {
      statusText = "Kamu Online"
      statusImage = require('../assets/images/online.svg')
    } else {
      statusText = "Kamu Offline"
      statusImage = require('../assets/images/offline.svg')
    }

    return (
        <Container>
            <Header />
            <Content contentContainerStyle={{flex:1}}>
              <Card>
                  <CardItem>
                    <Body>
                      <Text>Aktifkan Fitur Pemijat </Text>
                    </Body>
                    <Right>
                        <Switch onValueChange={this.handleToogle.bind(this)} value={this.state.switch}/>
                    </Right>
                  </CardItem>
                  <CardItem bordered style={{backgroundColor: '#e8e8e8'}}>
                    <Text>Debug Menu</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>PID </Text>
                    </Body>
                    <Right>
                        <Text> {this.state.pid} </Text>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>Background Processing </Text>
                    </Body>
  
                    <Right>
                        <Text>{this.state.task.taskName}</Text>
                    </Right>
                  </CardItem>

              </Card>
              <View style={{justifyContent:"center", alignItems:'center',flex:1}}>
                <Image 
                  source={statusImage}
                  style={{width:200, height:150}}/>
                 <Text style={{fontSize:20}}>{statusText}</Text>
              </View>
            </Content>     
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                Apakah anda ingin menerima pesanan ini?
              </Dialog.Description>
              <Dialog.Button label="Terima" onPress={()=> {
                  this._terimaPesanan()
                  this.setState({dialogVisible:false})
              }}/>
              <Dialog.Button label="Tolak" onPress={()=> {
                this._tolakPesanan()
                this.setState({dialogVisible:false})
              }}/>
            </Dialog.Container> 
        </Container>
    );
  }
}



TaskManager.defineTask(TASK, async ({ data, error }) => {
  
  if (error) {
      console.log(error)
      return;
    }

    if (data) {

      const { locations } = data;
      const latitude = locations[0].coords.latitude
      const longitude = locations[0].coords.longitude

      const pid = await AsyncStorage.getItem('pid')

      if (!pid) {
        console.log('pid tidak ada')
        return
      }

      
      dbh.collection("activePartner").doc(pid).set({
        lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
      }).then(saySuccess).catch(sayError)

    }
  })