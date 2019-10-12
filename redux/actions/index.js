import _ from 'underscore'
import { 
    SELESAIKAN_PESANAN, 
    SELESAIKAN_PESANAN_SUKSES, 
    SELESAIKAN_PESANAN_GAGAL,  
    CHANGE_SCREEN
} from "../constants";


function requestPosts(IDpesanan){
    return {
        type: SELESAIKAN_PESANAN,
        IDpesanan
      }
}

function sendReceivePosts(IDpesanan, json){
    return {
        type         : SELESAIKAN_PESANAN_SUKSES,
        data         : json,
        receivedAt   : Date.now(),
        currentScreen: 'home',
        IDpesanan,
    }
}

function sendFailurePosts(json){
    return {
        type : SELESAIKAN_PESANAN_GAGAL,
        error: json.error,
    }
}


export function changeScreen(screen){
    return {
        type         : CHANGE_SCREEN,
        screen,
    }
}

// TODO: ganti endpoinya bro
export function fetchSelesaikanPesanan(IDpesanan) {
    return function(dispatch) {
      dispatch(requestPosts(IDpesanan))
      return fetch(`https://jsonplaceholder.typicode.com/todos/` + IDpesanan)
        .then(
          response => {
              try { return response.json() } catch (error) { return response.text() }
          },
          error => dispatch(sendFailurePosts({error}))
        )
        .then(json => {
                if (_.isObject(json)) { dispatch(sendReceivePosts(IDpesanan, json)) } else { dispatch(sendFailurePosts({error:json})) }
            }
        )
    }
}