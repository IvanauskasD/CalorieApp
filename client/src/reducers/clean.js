import {
    LOGOUT
} from '../actions/types';



function cleanReducer(state, action) {
      if(action.type === LOGOUT)
      {
          state = null
      }
      return state

}

export default cleanReducer;