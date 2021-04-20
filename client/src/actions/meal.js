import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_MEAL,
    ERROR_MEAL,
    CLEAR_MEAL
} from './types';

// Create or update diet profile
export const createMeal = (formData) => async (
    dispatch
) => {
    try {
        const res = await api.post('/meal', formData);

        dispatch({
            type: GET_MEAL,
            payload: res.data
        });
        dispatch(setAlert('Meal Created', 'success'));

    } catch (err) {
        if (err.response) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type: ERROR_MEAL,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }


    }
};



// Get meal by date
export const getMealByDate = date => async (dispatch) => {
    try {
      const res = await api.get(`/meal/mealz?date=${date}`);
      
      dispatch({
        type: GET_MEAL,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ERROR_MEAL,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  // Delete experience
export const deleteMeal = (id, i, formData)  => async (dispatch) => {
    try {
      
      const res = await api.post(`/meal/${id}&${i}`, formData);
      console.log(res)
      dispatch({
        type: CLEAR_MEAL,
        payload: res.data
      });
  
      dispatch(setAlert('Meal Removed', 'success'));
    } catch (err) {
      dispatch({
        type: ERROR_MEAL,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
