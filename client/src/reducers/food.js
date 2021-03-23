import {
    GET_FOOD,
    FOOD_ERROR
} from '../actions/types';


const initialState = {
    food: null,
    loading: true,
    error: {}
};

function foodReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_FOOD:
            return {
                ...state,
                food: payload,
                loading: false
            };
        case FOOD_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                food: null
            };
        default:
            return state;
    }

}

export default foodReducer;