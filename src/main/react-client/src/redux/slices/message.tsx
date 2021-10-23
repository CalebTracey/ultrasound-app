/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit'

interface messageSliceState {
    text: string | null
    error: boolean
}
const initialMessageState: messageSliceState = {
    text: null,
    error: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState: initialMessageState,
    reducers: {
        newMessage: (state, action: PayloadAction<string>) => {
            state.text = action.payload
            state.error = false
        },
        newError: (state, action: PayloadAction<string>) => {
            state.text = action.payload
            state.error = true
        },
        clearMessage: (state) => {
            state.text = null
            state.error = false
        },
    },
})
export const { newMessage, newError, clearMessage } = messageSlice.actions

export default messageSlice.reducer as Reducer<typeof initialMessageState>
