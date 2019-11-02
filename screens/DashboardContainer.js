import React from 'react';
import PropsTypes from 'prop-types';
import * as Permissions from 'expo-permissions'; // eslint-disable-line
import * as TaskManager from 'expo-task-manager';
import { ToastAndroid, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import Dashboard from './Location';
import initApp from '../library/firebase/firebase';
import { getLastString } from '../library/String';

const firebase = initApp();
const dbh = firebase.firestore();
const TASK = 'update-position';
const TIMER = 20;

class DashboardContainer extends React.Component {
  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      ToastAndroid.show('Oops, this will not work on Sketch in an Android emulator. Try it on your device', ToastAndroid.SHORT);
    } else {
      this._getLocationAsync();
    }
  }

  async componentDidMount() {
    await this._listenToPesanan();
    await this._getAllTask();
  }

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
    }

    /**
    * @typedef {Object} coords
    * @property {*} accuracy - 87.5999984741211.
    * @property {*} altitude - 0.
    * @property {*} heading - 0.
    * @property {*} latitude - -6.8116553.
    * @property {*} longitude - 107.9185063.
    * @property {*} speed - 0.
    */

    /**
    * @typedef {Object} location
    * @property {coords} coords -
    * @property {*} mocked - false.
    * @property {*} timestamp - 1572669469270.
    */

    /**
     * @type {location} location
     */
    const location = await Location.getCurrentPositionAsync({});
    const { onGetLocation } = this.props;

    onGetLocation(location);
  }

  _listenToPesanan() {
    const { pid, onAdaPesanan } = this.props;
    dbh.collection('pesanan').where('partner_id', '==', pid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const pesanan = [];
            querySnapshot.forEach((doc) => {
              pesanan.push({
                id_pesanan: getLastString(doc._document.proto.name),
                user_id: doc.data().user_id,
                lokasi: doc.data().user_location,
                payment: doc.data().payment,
              });
            });

            if (pesanan.length > 0) {
              onAdaPesanan(pesanan[0]);
            } else {
              console.log('Tidak ada pesanan');
            }
          }
        });
      });
  }

  async _getAllTask() {
    const { onGetTask } = this.props;
    const res = await TaskManager.getRegisteredTasksAsync();
    // this.updateLocationTask = this.allTask.filter((task) => task.taskName === TASK);
    console.log(res);
    onGetTask(res);

    // if (this.updateLocationTask.length) {
    //   this.setState({
    //     task  : this.updateLocationTask[0],
    //     switch: true
    //   })
    // } else {
    //   this.setState({
    //     task  : {taskName:'none'},
    //     switch: false
    //   })
    // }
  }


  static navigationOptions = {
    header: null,
  }

  render() {
    return <Dashboard {...this.props} />; // eslint-disable-line
  }
}

DashboardContainer.propTypes = {
  pid: PropsTypes.string,
  onAdaPesanan: PropsTypes.func,
  onGetLocation: PropsTypes.func,
  onGetTask: PropsTypes.func.isRequired,
};

DashboardContainer.defaultProps = {
  pid: '',
  onAdaPesanan: () => console.log('sdsada'),
  onGetLocation: () => console.log('sdsad'),
};

TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }

  if (data) {

    const { locations } = data;
    const latitude = locations[0].coords.latitude
    const longitude = locations[0].coords.longitude

    const pid = await AsyncStorage.getItem('pid')

    if (!pid) {
      console.log('pid tidak ada');
      return;
    }

    dbh.collection('activePartner').doc(pid).set({
      lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
    })
      .then(() => console.log('success'))
      .catch((err) => console.log(err));

  }
})

export default DashboardContainer;
