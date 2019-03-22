import axios from 'axios'

export const SET_CURRENCY = 'SET_CURRENCY'
export const SET_SUCCESS = 'SET_SUCCESS'
export const SET_START = 'SET_START'
export const SET_ERROR = 'SET_ERROR'

const setSuccess = currency => ({
    type: SET_SUCCESS,
    payload: {
      ...currency
    }
})

const setError = error => ({
    type: SET_ERROR,
    payload: {
      error
    }
})

export const setCurrency = (currency, limit) => {
    return dispatch => {
        return axios.get('http://localhost:3000/', {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                currency: currency,
                limit: limit
            }
        })
        .then(function(response) {
            console.log(response, 'response')
            return dispatch({
                type: SET_CURRENCY,
                payload: response.data
            })
            //setSuccess(response))
        })
        .catch( function(error) {
            return dispatch(setError(error))
        })
    }
}