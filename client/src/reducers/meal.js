import {
    GET_MEAL,
    ERROR_MEAL,
    CLEAR_MEAL
} from '../actions/types';


const initialState = {
    meal: null,
    loading: true,
    error: {}
};

function mealReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_MEAL:
            return {
                ...state,
                meal: payload,
                loading: false
            };
        case ERROR_MEAL:
            return {
                ...state,
                error: payload,
                loading: false,
                meal: null
            };
        case CLEAR_MEAL:
            return {
                ...state,
                meal: null
            };
        default:
            return state;
    }

}

export default mealReducer;