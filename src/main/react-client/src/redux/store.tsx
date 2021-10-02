/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction, Store, Dispatch } from 'redux'
import auth from './reducers/auth'
import message from './reducers/message'
import data from './reducers/data'

export const store = configureStore({
    reducer: {
        auth,
        message,
        data,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type TDispatch = ThunkDispatch<RootState, void, AnyAction>
export type TStore = Store<RootState, AnyAction> & { dispatch: TDispatch }
export type TGetState = () => RootState
