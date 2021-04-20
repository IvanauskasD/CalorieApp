import {
    GET_SPORT,
    ERROR_SPORT
} from '../actions/types';


const initialState = {
    sport: null,
    loading: true,
    error: {}
};

function sportReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_SPORT:
            return {
                ...state,
                sport: payload,
                loading: false
            };
        case ERROR_SPORT:
            return {
                ...state,
                error: payload,
                loading: false,
                sport: null
            };
        default:
            return state;
    }

}

export default sportReducer;