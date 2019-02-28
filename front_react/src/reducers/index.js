import {
    SET_START,
    SET_SUCCESS,
    SET_ERROR
} from '../actions/actions'

const defaultState = {
    currency: 'USD',
    limit: 100
}

const rootReducer = async (state = defaultState, action) => {
    switch (action.type) {
        case SET_START:
          return {
            ...state,
            loading: true
          };
        case SET_SUCCESS:
          return {
            ...state,
            loading: false,
            error: null,
            currency: {...state, data: action.payload}
          };
        case SET_ERROR:
          return {
            ...state,
            loading: false,
            error: action.payload.error
          };
        default:
          return state;
    }
}

export default rootReducer