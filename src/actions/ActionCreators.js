import queryString from 'query-string';
import {
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import baseURL from '../../constants/API';
import {
  TERIMA_PESANAN, TERIMA_PESANAN_SUCCESS, TERIMA_PESANAN_FAILED,
  LOGIN, LOGIN_SUCCESS, LOGIN_FAILED,
  SELESAIKAN_PESANAN,
  GO_TO_PELANGGAN,
  ON_ADA_PESAN,
  UPDATE_LOCATION,
  // TOGGLE_AKTIF,
} from '../../constants/ActionTypes';
import NavigationService from '../screens/navigation/NavigationService';
import SCREEN from '../../constants/Screens';

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


// Home Screen
// export function togglePemijat() {
//   return  async (dispatch) => {

//     await this.setState({switch:!this.state.switch})
//     const updateLocationTask = this.updateLocationTask

//     if (this.state.switch) {
//       await Location.startLocationUpdatesAsync(TASK, {
//         accuracy: Location.Accuracy.High,
//       });
//       this._getAllTask()

//     } else {
//         if(updateLocationTask.length){
//           TaskManager.unregisterTaskAsync(TASK)
//           dbh.collection('activePartner').doc(this.state.pid).delete()
//           this._getAllTask()
//         }
//     }
//   };
// }

export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    payload: location,
  };
}

export function tampilkanDialogPemesanan(data_pesan) {
  return {
    type: ON_ADA_PESAN,
    payload: data_pesan,
  };
}

export function goToPelanggan(detail_pelanggan) {
  return {
    type: GO_TO_PELANGGAN,
    payload: detail_pelanggan,
  };
}

export function selesaikanPesanan() {
  return (dispatch) => {
    dispatch({
      type: SELESAIKAN_PESANAN,
    });
  };
}


export function terimaPesanan(param) {
  const {
    user_id,
    payment,
    id_pesanan,
  } = param;

  return (dispatch, getState) => {
    dispatch({
      type: TERIMA_PESANAN,
    });

    const {
      partner_id,
      current_location,
    } = getState();

    const bodyParam = {
      user_id,
      partner_id,
      payment,
      id_pesanan,
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
        if (typeof res === 'object' && res.code === 200) {
          dispatch({
            type: TERIMA_PESANAN_SUCCESS,
            payload: res,
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


export default terimaPesanan;
