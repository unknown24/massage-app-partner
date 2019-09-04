import React, { Component } from 'react';
import { Platform, View, StyleSheet, Switch } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right } from 'native-base';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);


import initApp from '../library/firebase/firebase';

const firebase   = initApp()
const dbh        = firebase.firestore();
const TASK       = 'update-position'
const partner_id = 1


export default class App extends Component {
  state = {
    location    : null,
    errorMessage: null,
    switch      : false,
    task        : {}
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
        // await Location.startLocationUpdatesAsync('juara', {
        //     accuracy: Location.Accuracy.High,
        //   });
        
    }

    _listenToPesanan(){
      dbh.collection("pesanan")
        .onSnapshot(function(querySnapshot) {
            
          var cities = [];
            querySnapshot.forEach(function(doc) {
                cities.push(doc.data().lokasi);
            });
            console.log("Current cities in CA: ", cities.join(", "));
        })
    }

    async _getAllActivePartner (){
      const activePartner = await dbh.collection("activePartner").get().docs.map(doc => doc.data())
      console.log(activePartner)
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
  };


  updateCurrentLocation(){
    const partnerAktif = dbh.collection("activePartner").doc(partner_id)
    partnerAktif.set({
      lokasi: new firebase.firestore.GeoPoint(0.1, 0.2),
    })
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
          dbh.collection('activePartner').doc('p'+partner_id).delete()
          this._getAllTask()
        }
    }

  }
  
  render() {

    return (
        <Container>
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
      dbh.collection("activePartner").doc("p"+partner_id).set({
        lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
      })
    }
  })