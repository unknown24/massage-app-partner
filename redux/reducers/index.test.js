import reducer from './index'
import {CHANGE_SCREEN} from '../constants'


describe('todos reducer', () => {
  it('Should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
        {
            currentScreen: 'login',
            error        : "",
            loader       : false,
            data         : []
        }
      )
  })

  it('should handle Change screen', () => {
    
    expect(
      reducer(undefined, {
        type  : CHANGE_SCREEN,
        screen: 'juaras'
      })
    ).toEqual(
      {
        currentScreen: 'juaras',
        data         : [],
        error        : "",
        loader       : false,
      }
    ) 
  })

})