import {
    GET_DIETPROFILE,
    DIETPROFILE_ERROR,
} from '../actions/types';


const initialState = {
    dietprofile: null,
    loading: true,
    error: {}
};

function dietProfileReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_DIETPROFILE:
            return {
                ...state,
                dietprofile: payload,
                loading: false
            };
        case DIETPROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                dietprofile: null
            };
        default:
            return state;
    }

}

export default dietProfileReducer;