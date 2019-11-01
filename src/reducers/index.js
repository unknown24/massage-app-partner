import update from 'immutability-helper';
import { GO_TO_PELANGGAN, TERIMA_PESANAN, ON_ADA_PESAN } from '../../constants/ActionTypes';


const initialData = {
  partner_id: null,
  current_location: null,
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
