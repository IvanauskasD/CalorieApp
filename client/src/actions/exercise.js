import api from '../utils/api';
import { setAlert } from './alert';
import qs from 'query-string';

import {
    GET_EXERCISE,
    ERROR_EXERCISE,
    CLEAR_EXERCISE
} from './types';

// Create or update exercise
export const createExercise = (formData) => async (
    dispatch
) => {
    try {
        const res = await api.post('/exercise', formData);

        dispatch({
            type: GET_EXERCISE,
            payload: res.data
        });
        dispatch(setAlert('Exercise Created', 'success'));

    } catch (err) {
        if (err.response) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type: ERROR_EXERCISE,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }


    }
};



// Get exercise by date
export const getExerciseByDate = date => async (dispatch) => {
    try {
      const res = await api.get(`/exercise/exercises?date=${date}`);
      
      dispatch({
        type: GET_EXERCISE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ERROR_EXERCISE,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  // Delete experience
export const deleteExercise = (id, i, formData)  => async (dispatch) => {
    try {
      
      const res = await api.post(`/exercise/${id}&${i}`, formData);
    
      dispatch({
        type: CLEAR_EXERCISE,
        payload: res.data
      });
  
      dispatch(setAlert('Exercise Removed', 'success'));
    } catch (err) {
      dispatch({
        type: ERROR_EXERCISE,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
