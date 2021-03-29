import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_MEAL,
    ERROR_MEAL
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
        if(err.response){
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
