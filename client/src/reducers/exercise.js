import {
    GET_EXERCISE,
    ERROR_EXERCISE,
    CLEAR_EXERCISE
} from '../actions/types';


const initialState = {
    exercise: null,
    loading: true,
    error: {}
};

function exerciseReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_EXERCISE:
            return {
                ...state,
                exercise: payload,
                loading: false
            };
        case ERROR_EXERCISE:
            return {
                ...state,
                error: payload,
                loading: false,
                exercise: null
            };
        case CLEAR_EXERCISE:
            return {
                ...state,
                exercise: null
            };
        default:
            return state;
    }

}

export default exerciseReducer;