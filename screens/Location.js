import React, { Component } from 'react';
import { Platform, View, StyleSheet, Switch, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import queryString from 'query-string'
import { Container, Header, Content, Card, CardItem, Text, Icon, Right } from 'native-base';
import Dialog from "react-native-dialog";


import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);


import { getLastString } from '../library/String'
import initApp from '../library/firebase/firebase';

const firebase   = initApp()
const dbh        = firebase.firestore();
const TASK       = 'update-position'
const partner_id = 'p1'
const TIMER  = 20


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
    timer        : TIMER
  };


  componentWillMount() {
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
       this._listenToPesanan(this)
    }


    _listenToPesanan(that){

      dbh.collection("pesanan").where("partner_id", "==", partner_id)
        .onSnapshot(function(querySnapshot) {
          querySnapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                var pesanan = [];
                querySnapshot.forEach(function(doc) {

                  pesanan.push({
                    id_pesanan: getLastString(doc._document.proto.name),
                    user_id   : doc.data().user_id,
                    lokasi    : doc.data().user_location
                  })

                })

                if (pesanan.length > 0) {
                    
                  that.setState({
                      currentPesanan: pesanan[0],
                      dialogVisible : true
                  })

                  let i = TIMER
                  that.interval = setInterval(function(){
                    if(i==0){
                      that._tolakPesanan()
                    }
                    console.log(i)
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
          dbh.collection('activePartner').doc(partner_id).delete()
          this._getAllTask()
        }
    }

  }

  _terimaPesanan(){
    clearInterval(this.interval)
    const params = {
      user_id   : this.state.currentPesanan.user_id,
      partner_id: partner_id,
      payment   : this.state.currentPesanan.payment,
      id_pesanan: this.state.currentPesanan.id_pesanan,
    }
    const stringified = queryString.stringify(params)
    fetch('http://d24635f6.ngrok.io/massage-app-server/acceptOrder.php??' + stringified)
      .then(res=>res.json()).then(res=> {
        console.log(res)
        this.setState({dialogVisible:false})
      })
  }

  _tolakPesanan(){
    clearInterval(this.interval)
    const params = {
      user_id   : this.state.currentPesanan.user_id,
      latitude  : this.state.currentPesanan.lokasi._lat,
      longitude : this.state.currentPesanan.lokasi._long,
      skipped   : partner_id,
      id_pesanan: this.state.currentPesanan.id_pesanan,
    }
    const stringified = queryString.stringify(params)
    fetch('http://d24635f6.ngrok.io/massage-app-server/order.php?' + stringified)
      .then(res=>res.json()).then(res=> {
        console.log(res)

        this.setState({dialogVisible:false})
      })
  }
  
  render() {
    const title = `Ada Pesanan (${this.state.timer})`
    return (
        <Container>
            <Header />
            <Content>
              <Card>
                  <CardItem>
                    <Text>Aktifkan Fitur Pemijat </Text>
                    <Right>
                        <Switch onValueChange={this.handleToogle.bind(this)} value={this.state.switch}/>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Text>Background Processing </Text>
                    <Right>
                        <Text>{this.state.task.taskName}</Text>
                    </Right>
                  </CardItem>
              </Card>
            </Content>     
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                Apakah anda ingin menerima pesanan ini?
              </Dialog.Description>
              <Dialog.Button label="Terima" onPress={()=> {
                  this._terimaPesanan()
                  this.setState({dialogVisible:false})
              }}
                />
              <Dialog.Button label="Tolak" onPress={()=> {
                this._tolakPesanan()
                this.setState({dialogVisible:false})
              }}/>
            </Dialog.Container> 
        </Container>
    );
  }
}


TaskManager.defineTask(TASK, ({ data, error }) => {
    if (error) {
      console.log(error)
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      
      const { locations } = data;
      const latitude = locations[0].coords.latitude
      const longitude = locations[0].coords.longitude

      // do something with the locations captured in the background
      dbh.collection("activePartner").doc(partner_id).set({
        lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
      })
    }
  })