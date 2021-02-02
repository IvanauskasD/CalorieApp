import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_FOOD,
    UPDATE_FOOD,
    FOOD_ERROR
} from './types';

// Create or update food card
export const createFood = (formData, history) => async (
    dispatch
) => {
    try {
        const res = await api.post('/food', formData);

        dispatch({
            type: GET_FOOD,
            payload: res.data
        });

        dispatch(setAlert('Food Card Created', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: FOOD_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};