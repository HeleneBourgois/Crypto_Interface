import { createStore, combineReducers } from 'redux'
import rootReducer from '../reducers/index.js'

export const store = createStore(
    combineReducers({
        state: rootReducer
    })
)