import {
    GET_FDIARY,
    ERROR_FDIARY,
    ADD_FDIARY
} from '../actions/types';


const initialState = {
    fDiary: null,
    loading: true,
    error: {}
};

function fDiaryReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_FDIARY:
            return {
                ...state,
                fDiary: payload,
                loading: false
            };
        case ERROR_FDIARY:
            return {
                ...state,
                error: payload,
                loading: false,
                fDiary: null
              };
        default:
            return state;
    }

}

export default fDiaryReducer;