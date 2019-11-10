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
  UPDATE_LOCATION,
  TOGGLE_AKTIF,
  UPDATE_ORDER_STATE,
  SELESAIKAN_PESANAN_SUCCESS,
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
              .then(() => NavigationService.navigate(SCREEN.DASHBOARD));
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
  return (dispatch, getState) => {
    const { current_pesanan, partner_id } = getState();

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
     * @type {data_pesanan} pesanan
     */
    const pesanan = current_pesanan;
    const data = {
      id_pesanan: pesanan.id_pesanan,
      client_id: pesanan.user_id,
      partner_id,
      products: pesanan.products,
    };

    fetch(`${baseURL}/massage-app-server/apis/terapis/pesanan-selesai.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        NavigationService.navigate(SCREEN.DASHBOARD);
        if (typeof res === 'object') {
          dispatch({
            type: SELESAIKAN_PESANAN_SUCCESS,
            payload: res,
          });
        }
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
      }).then(async (res) => {
        if (typeof res === 'object' && res.error === '') {
          /**
            * @typedef {Object} res_location
            * @property {*} city - "".
            * @property {*} country - "".
            * @property {*} isoCountryCode - "".
            * @property {*} name - "".
            * @property {*} postalCode - "".
            * @property {*} region - "".
            * @property {*} street - "".
            *
          */

          /**
           * @type {res_location} res_
           */
          const res_ = await Location.reverseGeocodeAsync(data.lokasi);

          /**
           * id": "1",
          "email": "aep.stmik@gmail.com",
          "telepon": "123456",
          "password": "e10adc3949ba59abbe56e057f20f883e",
          "tipe": "user"
           */

          const res_user = await fetch(`${baseURL}apps/users/detail/${data.user_id}`).then((r) => r.json());
          dispatch({
            type: TERIMA_PESANAN_SUCCESS,
            payload: {
              nama: res_user[0].email,
              lokasi_client: `${res_[0].street} ${res_[0].city} ${res_[0].name} ${res_[0].region} ${res_[0].country} ${res_[0].postalCode}`,
              kontak: res_user[0].telepon,
              id_pesanan: res.result,
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
  console.log(error);
});

export default terimaPesanan;
