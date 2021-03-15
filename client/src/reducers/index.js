import { combineReducers} from 'redux'
import alert from './alert'
import auth from './auth'
import profile from './profile'
import dietprofile from './dietprofile'
import goal from './goal'

export default combineReducers({
     alert,
     auth,
     profile,
     dietprofile,
     goal
})