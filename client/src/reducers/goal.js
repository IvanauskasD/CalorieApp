import {
    GET_GOAL,
    ERROR_GOAL
} from '../actions/types';


const initialState = {
    goal: null,
    loading: true,
    error: {}
};

function goalReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_GOAL:
            return {
                ...state,
                goal: payload,
                loading: false
            };
        case ERROR_GOAL:
            return {
                ...state,
                error: payload,
                loading: false,
                goal: null
            };
        default:
            return state;
    }

}

export default goalReducer;