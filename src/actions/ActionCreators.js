import queryString from 'query-string';
import baseURL from '../../constants/API';
import { TERIMA_PESANAN, TERIMA_PESANAN_SUCCESS, TERIMA_PESANAN_FAILED } from '../../constants/ActionTypes';


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
