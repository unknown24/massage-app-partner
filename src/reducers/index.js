import update from 'immutability-helper';
import { GO_TO_PELANGGAN, TERIMA_PESANAN, ON_ADA_PESAN, UPDATE_LOCATION, LOGIN, LOGIN_SUCCESS } from '../../constants/ActionTypes';


const initialData = {
  partner_id: null,
  current_location: null,
  status_aktif: false,
  order_state: 'idle',
  current_pesanan: null,
  current_client: {
    nama: 'system',
    alamat: 'system',
    no_kontak: 'system',
  },
};

function handlePemesananState(state = initialData, action) {
  switch (action.type) {
    case ON_ADA_PESAN: {
      /**
        *
        * @typedef {Object} data_pesanan
        * @property {*} id_pesanan - "".
        * @property {*} user_id - "".
        * @property {*} lokasi - "".
        * @property {*} payment - "".
      */

      /**
       * @type {data_pesanan} data
       */
      const data = action.payload;
      const new_state = update(state, {
        current_client: {
          current_pesanan: data,
          order_state: 'ada_pesanan',
        },
      });
      return new_state;
    }

    case LOGIN_SUCCESS: {
      /**
        * @typedef {Object} data_login
        * @property {*} data - "". {"id": "p4"},
        * @property {*} status - "".
      */

      /**
       * @type {data_login} data
       */
      const data = action.payload;
      const new_state = update(state, {
        partner_id: { $set: data.data.id },
      });
      return new_state;
    }

    case TERIMA_PESANAN: {
      /**
        * wadaw
        * @typedef {Object} data_pesanan
        * @property {*} id_pesanan - "".
        * @property {*} user_id - "".
        * @property {*} lokasi - "".
        * @property {*} payment - "".
      */

      /**
       * @type {data_pesanan} data
       */
      const data = action.payload;

      const new_state = update(state, {
        current_client: {
          alamat: data.lokasi,
        },
      });
      return new_state;
    }

    case UPDATE_LOCATION: {
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
      const location = action.payload;
      const new_state = update(state, {
        current_location: {
          $set: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      });
      return new_state;
    }

    case GO_TO_PELANGGAN: {
      /**
        * wadaw
        * @typedef {Object} data
        * @property {*} partner_id - "".
        * @property {*} user_id - "".
        * @property {*} status - "".
        * @property {*} payment - "".
      */

      /**
       * @type {data} data
       */
      const data = action.payload;

      const new_state = update(state, {
        current_client: {
          nama: data,
          alamat: '',
          no_kontak: '',
        },
      });

      return new_state;
    }

    default:
      return state;
  }
}


export default handlePemesananState;
