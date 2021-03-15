import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_DIETPROFILE,
    DIETPROFILE_ERROR,
} from './types';

// Get diet profile by ID
export const getDietProfileById = (userId) => async (dispatch) => {
    try {
        const res = await api.get(`/dietprofile/profile/${userId}`);

        dispatch({
            type: GET_DIETPROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: DIETPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Create or update diet profile
export const createDietProfile = (formData, history, edit = false) => async (
    dispatch
) => {
    try {
        const res = await api.post('/dietprofile', formData);

        dispatch({
            type: GET_DIETPROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Diet Profile Updated' : 'Diet Profile Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: DIETPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Get current users diet profile
export const getCurrentDietProfile = () => async (dispatch) => {
    try {
        const res = await api.get('/dietprofile/me');

        dispatch({
            type: GET_DIETPROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: DIETPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};