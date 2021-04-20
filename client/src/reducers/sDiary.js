import {
    GET_SDIARY,
    ERROR_SDIARY,
} from '../actions/types';


const initialState = {
    sDiary: null,
    loadingz: true,
    error: {}
};

function sDiaryReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_SDIARY:
            return {
                ...state,
                sDiary: payload,
                loadingz: false
            };
        case ERROR_SDIARY:
            return {
                ...state,
                error: payload,
                loadingz: false,
                sDiary: null
              };
        default:
            return state;
    }

}

export default sDiaryReducer;