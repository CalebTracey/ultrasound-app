/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, Store } from 'redux'
import auth from './slices/auth'
import item from './slices/item'
import classification from './slices/classification'
import subMenu from './slices/subMenu'
import message from './slices/message'

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        item: item.reducer,
        message: message.reducer,
        subMenu: subMenu.reducer,
        classification: classification.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})
export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type TDispatch = ThunkDispatch<RootState, void, AnyAction>
export type TStore = Store<RootState, AnyAction> & { dispatch: TDispatch }
export type TGetState = () => RootState
