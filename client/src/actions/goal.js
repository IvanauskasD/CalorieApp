import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_GOAL,
    ERROR_GOAL
} from './types';

// Update goals
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

// Get goal by ID
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

// Get current users goals
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