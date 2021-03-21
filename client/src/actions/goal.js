import api from '../utils/api';
import { setAlert } from './alert';

import {
    ADD_GOAL,
    UPDATE_GOAL,
    GET_GOAL,
    ERROR_GOAL
} from './types';

// Create or update diet profile
export const createGoal = (formData, history, edit = false) => async (
    dispatch
) => {
    try {
        const res = await api.post('/goal', formData);

        dispatch({
            type: GET_GOAL,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Goal Updated' : 'Goal Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }
    } catch (err) {
        if(err.response){
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: ERROR_GOAL,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }


    }
};

// Get diet profile by ID
export const getGoalById = (dietprofile_id) => async (dispatch) => {
    try {
        const res = await api.get(`/goal/profile/${dietprofile_id}`);

        dispatch({
            type: GET_GOAL,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_GOAL,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Get current users diet profile
export const getCurrentGoals = () => async (dispatch) => {
    try {
        const res = await api.get('/goal/me');

        dispatch({
            type: GET_GOAL,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_GOAL,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};