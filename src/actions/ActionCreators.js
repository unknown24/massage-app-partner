import queryString from 'query-string';
import {
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

import baseURL from '../../constants/API';
import {
  TERIMA_PESANAN, TERIMA_PESANAN_SUCCESS, TERIMA_PESANAN_FAILED,
  LOGIN, LOGIN_SUCCESS, LOGIN_FAILED,
  SELESAIKAN_PESANAN,
  UPDATE_LOCATION,
  TOGGLE_AKTIF,
  UPDATE_ORDER_STATE,
} from '../../constants/ActionTypes';
import NavigationService from '../screens/navigation/NavigationService';
import SCREEN from '../../constants/Screens';
import { TASK } from '../../constants/others';
import { dbh, fb as firebase } from '../../library/firebase/firebase';


// Login Screen
export function login(form_input) {
  return (dispatch) => {
    const body = new FormData();
    body.append('email', form_input.email);
    body.append('password', form_input.password);
    body.append('tipe', 'partner');
    try {
      dispatch({ type: LOGIN });
      fetch(`${baseURL}massage-app-server/login.php`, { method: 'POST', body })
        .then((res) => res.json())
        .then((res) => {
          if (res.status) {
            dispatch({
              type: LOGIN_SUCCESS,
              payload: res,
            });
            AsyncStorage.multiSet([['login', '1'], ['pid', res.data.id]])
              .then(() => NavigationService.navigate(SCREEN.HOME));
          } else {
            dispatch({
              type: LOGIN_FAILED,
              payload: res,
            });
            ToastAndroid.show(res.message, ToastAndroid.SHORT);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
}

// Dashboard Screen

export function selesaikanPesanan() {
  return (dispatch) => {
    dispatch({
      type: SELESAIKAN_PESANAN,
    });
  };
}


export function terimaPesanan() {
  return (dispatch, getState) => {
    dispatch({
      type: TERIMA_PESANAN,
    });

    const {
      partner_id,
      current_location,
      current_pesanan,
    } = getState();

    /**
    * @typedef {Object} Geopoint
    * @property {number} longitude
    * @property {number} latitude
    */

    /**
      * @typedef {Object} data_pesanan
      * @property {*} id_pesanan - "".
      * @property {*} user_id - "".
      * @property {Geopoint} lokasi - "".
      * @property {*} payment - "".
    */

    /**
     * @type {data_pesanan} data
     */
    const data = current_pesanan;

    const bodyParam = {
      user_id: data.user_id,
      partner_id,
      payment: data.payment,
      id_pesanan: data.id_pesanan,
      location: current_location,
    };
    const stringified = queryString.stringify(bodyParam);

    fetch(`${baseURL}massage-app-server/acceptOrder.php?${stringified}`)
      .then((res) => {
        try {
          const json = res.json();
          return json;
        } catch (error) {
          return res.text();
        }
      }).then((res) => {
        if (typeof res === 'object' && res.error === '') {
          dispatch({
            type: TERIMA_PESANAN_SUCCESS,
            payload: {
              lokasi_client: data.lokasi,
              response: res,
            },
          });
        } else {
          dispatch({
            type: TERIMA_PESANAN_FAILED,
            payload: res,
          });
        }
      });
  };
}

export function tolakPesanan() {
  return async (dispatch, getState) => {
    const { partner_id, current_pesanan } = getState();
    const params = {
      user_id: current_pesanan.user_id,
      latitude: current_pesanan.lokasi.latitude,
      longitude: current_pesanan.lokasi.longitude,
      skipped: partner_id,
      id_pesanan: current_pesanan.id_pesanan,
    };
    const stringified = queryString.stringify(params);
    fetch(`${baseURL}massage-app-server/order.php?${stringified}`)
      .then((res) => {
        try {
          return res.json();
        } catch (error) {
          console.log(error);
          return res.text();
        }
      }).then(() => {
        dispatch({ type: UPDATE_ORDER_STATE, payload: 'idle' });
      });
  };
}


export function toggleData() {
  return async (dispatch, getState) => {
    const { partner_id, status_aktif } = getState();
    if (!status_aktif) {
      dispatch({ type: TOGGLE_AKTIF, payload: true });
      await Location.startLocationUpdatesAsync(TASK, {
        accuracy: Location.Accuracy.High,
      });

      dispatch({ type: TOGGLE_AKTIF, payload: true });
    } else {
      TaskManager.unregisterTaskAsync(TASK);
      dbh.collection('activePartner').doc(partner_id).delete();
      dispatch({ type: TOGGLE_AKTIF, payload: false });
    }
  };
}

// Utility

export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    payload: location,
  };
}

TaskManager.defineTask(TASK, async ({ data, error }) => {
  const { latitude, longitude } = data.locations[0].coords;
  const pid = await AsyncStorage.getItem('pid');
  dbh.collection('activePartner').doc(pid).set({
    lokasi: new firebase.firestore.GeoPoint(latitude, longitude),
  })
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
});

export default terimaPesanan;
