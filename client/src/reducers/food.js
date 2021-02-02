import {
    GET_FOOD,
    UPDATE_FOOD,
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
            //   case UPDATE_FOOD:
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
                profile: null
            };
        // case CLEAR_PROFILE:
        //     return {
        //         ...state,
        //         profile: null
        //     };
        default:
            return state;
    }
}

export default foodReducer;