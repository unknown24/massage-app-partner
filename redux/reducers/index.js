import {
    SELESAIKAN_PESANAN,
    SELESAIKAN_PESANAN_GAGAL,
    SELESAIKAN_PESANAN_SUKSES,
    CHANGE_SCREEN
} from '../constants'


const initialState = {
    currentScreen: 'login',
    loader       : false,
    error        : "",
    data         : []
} 


function handlePemesananState(
  state = initialState,
  action
) {
  switch (action.type) {
    case SELESAIKAN_PESANAN:
      return Object.assign({}, state, {
        loader: true
      })
    case SELESAIKAN_PESANAN_GAGAL:
      return Object.assign({}, state, {
        loader: false,
        error : action.error
      })
    case SELESAIKAN_PESANAN_SUKSES:
      return Object.assign({}, state, {
        loader: false,
        data  : action.data,
      })

    case CHANGE_SCREEN:
      return Object.assign({}, state, {
        currentScreen : action.screen
      })
    default:
      return state
  }
}


export default handlePemesananState