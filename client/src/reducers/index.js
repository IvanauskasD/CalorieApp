import { combineReducers} from 'redux'
import alert from './alert'
import auth from './auth'
import profile from './profile'
import dietprofile from './dietprofile'
import goal from './goal'
import food from './food'
import sport from './sport'
import meal from './meal'
import fDiary from './fDiary'
import sDiary from './sDiary'
import exercise from './exercise'

import {
     LOGOUT
 } from '../actions/types';

const appReducer = combineReducers({
     alert,
     auth,
     profile,
     dietprofile,
     goal,
     food,
     meal,
     fDiary,
     sDiary,
     sport,
     exercise,
})

const rootReducer = (state, action) => {
     if (action.type === LOGOUT) {
       state = undefined
     }
   
     return appReducer(state, action)
   }

   export default rootReducer
