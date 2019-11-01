import React, { Component } from 'react';
import {
  Platform, View, Switch, AsyncStorage, YellowBox, ToastAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'; // eslint-disable-line
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {
  Container, Header, Content, Card, CardItem, Text, Right, Body,
} from 'native-base';
import Dialog from 'react-native-dialog';
import Image from 'react-native-remote-svg';
import initApp from '../library/firebase/firebase';

YellowBox.ignoreWarnings(['Setting a timer']);

const firebase = initApp();
const dbh = firebase.firestore();
const TASK = 'update-position';
const TIMER = 20;

const online_image = require('../assets/images/online.svg');
const offline_image = require('../assets/images/offline.svg');

function saySuccess() {
  console.info('Document successfully');
}


function sayError(error) {
  console.error('Error operation document: ', error);
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switch_: false,
      timer: TIMER,
    };
  }


  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      ToastAndroid.show('Oops, this will not work on Sketch in an Android emulator. Try it on your device', ToastAndroid.SHORT);
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { onGetLocation } = this.props;
    if (status !== 'granted') {
      ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
    }

    const location = await Location.getCurrentPositionAsync({});
    onGetLocation(location);
  }

  static navigationOptions = {
    header: null,
  }

  render() {
    const { timer, switch_ } = this.state;
    const title = `Ada Pesanan (${timer})`;
    let statusImage;
    let statusText;

    if (switch_) {
      statusText = 'Kamu Online';
      statusImage = online_image;
    } else {
      statusText = 'Kamu Offline';
      statusImage = offline_image;
    }

    const {
      pid,
      taskname,
      displayDialogBox,
      valueToggleAktifkan,
      onTerima,
      onTolak,
      onAktifkan,
    } = this.props;

    return (
      <Container>
        <Header />
        <Content contentContainerStyle={{ flex: 1 }}>
          <Card>
            <CardItem>
              <Body><Text>Aktifkan Fitur Pemijat </Text></Body>
              <Right><Switch onValueChange={onAktifkan} value={valueToggleAktifkan} /></Right>
            </CardItem>
            <CardItem bordered style={{ backgroundColor: '#e8e8e8' }}>
              <Text>Debug Menu</Text>
            </CardItem>
            <CardItem>
              <Body><Text>PID </Text></Body>
              <Right><Text>{ pid }</Text></Right>
            </CardItem>
            <CardItem>
              <Body><Text>Background Processing </Text></Body>
              <Right><Text>{taskname}</Text></Right>
            </CardItem>
          </Card>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image
              source={statusImage}
              style={{ width: 200, height: 150 }}
            />
            <Text style={{ fontSize: 20 }}>{statusText}</Text>
          </View>
        </Content>
        <Dialog.Container visible={displayDialogBox}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
              Apakah anda ingin menerima pesanan ini?
          </Dialog.Description>
          <Dialog.Button
            label="Terima"
            onPress={onTerima}
          />
          <Dialog.Button
            label="Tolak"
            onPress={onTolak}
          />
        </Dialog.Container>
      </Container>
    );
  }
}

TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }

  if (data) {
    const { locations } = data;
    const { latitude } = locations[0].coords;
    const { longitude } = locations[0].coords;

    const pid = await AsyncStorage.getItem('pid');

    if (!pid) {
      console.log('pid tidak ada');
      return;
    }

    dbh.collection('activePartner').doc(pid).set({
      lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
    })
      .then(saySuccess)
      .catch(sayError);
  }
});

Dashboard.propTypes = {
  pid: PropTypes.string.isRequired,
  taskname: PropTypes.string.isRequired,
  displayDialogBox: PropTypes.bool.isRequired,
  valueToggleAktifkan: PropTypes.bool.isRequired,
  onGetLocation: PropTypes.func.isRequired,
  onTerima: PropTypes.func.isRequired,
  onTolak: PropTypes.func.isRequired,
  onAktifkan: PropTypes.func.isRequired,
};
