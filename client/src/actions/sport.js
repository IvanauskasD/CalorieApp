import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_SPORT,
    ERROR_SPORT,
    CLEAR_SPORT,
    ADD_SPORT
} from './types';

export const addSport = formData => async dispatch => {
    try {
      const res = await api.post('/add-sport', formData);
  
      dispatch({
        type: ADD_SPORT,
        payload: res.data
      });
      dispatch(setAlert('Sport Added', 'success'));
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: ERROR_SPORT
      });
    }
  };


export const searchSport = (formData) => async (
    dispatch
) => {
    try {
        const res = await api.post('/sport/search-sport', formData);

        dispatch({
            type: GET_SPORT,
            payload: res.data
        });

        dispatch(setAlert('Sport Searched', 'success'));


    } catch (err) {
      if(err.response){
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_SPORT,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
  }
}


// Get food by ID
export const getSportById = (sportId) => async (dispatch) => {
  try {
    const res = await api.get(`/sport/sport/${sportId}`);
    
    dispatch({
      type: GET_SPORT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_SPORT,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


// Get all profiles
export const getSports = () => async (dispatch) => {
    dispatch({ type: CLEAR_SPORT });
  
    try {
      const res = await api.get('/sport');
  
      dispatch({
        type: GET_SPORT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ERROR_SPORT,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

