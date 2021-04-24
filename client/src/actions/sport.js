import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_SPORT,
    ERROR_SPORT,
    CLEAR_SPORT,
    ADD_SPORT
} from './types';

// Create or update sport card
export const createSport = (formData, history) => async (
  dispatch
) => {
  try {
    const res = await api.post('/sport', formData);

    dispatch({
      type: GET_SPORT,
      payload: res.data
    });

    dispatch(setAlert('Sport Card Created', 'success'));

    history.push('/dashboard');

  } catch (err) {
    if (err.response) {
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
};

// Search for sport card
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


// Get sport by ID
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


// Get all sport cards
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

  // Approve sport
export const approveSport = (id, form) => async (dispatch) => {
  try {

    const res = await api.post(`/sport/approve/${id}`, form);
   
    dispatch({
      type: GET_SPORT,
      payload: res.data
    });

    dispatch(setAlert('Sport Approved', 'success'));
  } catch (err) {
    dispatch({
      type: ERROR_SPORT,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


// Get sports that are not approved
export const getNotApprovedSports = () => async (dispatch) => {
  try {
    const res = await api.get('/sport/not-approved-sports');
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

// Disapprove sport
export const disapproveSport = (id, form) => async (dispatch) => {
  try {

    const res = await api.post(`/sport/disapprove/${id}`, form);
   
    dispatch({
      type: GET_SPORT,
      payload: res.data
    });

    dispatch(setAlert('Sport Disapproved', 'success'));
  } catch (err) {
    dispatch({
      type: ERROR_SPORT,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

