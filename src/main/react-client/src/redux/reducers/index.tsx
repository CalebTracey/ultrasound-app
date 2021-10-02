import { combineReducers } from 'redux'
import auth from './auth'
import message from './message'
import data from './data'

export const rootReducer = combineReducers({
    auth,
    message,
    data,
})
