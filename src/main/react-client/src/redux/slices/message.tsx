/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'

interface messageSliceState {
    text: string | null
    error: boolean
}
const initialMessageState: messageSliceState = {
    text: null,
    error: false,
}

export const newError = createAsyncThunk(
    'message/error',
    async (message: string) => message
)

export const newMessage = createAsyncThunk(
    'message/new',
    async (message: string) => message
)
export const clearMessage = createAsyncThunk(
    'message/clear',
    async (state) => state
)

export const messageSlice = createSlice({
    name: 'message',
    initialState: initialMessageState,
    reducers: {
        // newMessage: (state, action: PayloadAction<string>) => {
        //     state.text = action.payload
        //     state.error = false
        // },
        // newError: (state, action: PayloadAction<string>) => {
        //     state.text = action.payload
        //     state.error = true
        // },
        // clearMessage: (state) => {
        //     state.text = null
        //     state.error = false
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(
            newMessage.fulfilled,
            (state, action: PayloadAction<string>) => {
                state.text = action.payload
                state.error = false
            }
        )
        builder.addCase(
            newError.fulfilled,
            (state, action: PayloadAction<string>) => {
                state.text = action.payload
                state.error = true
            }
        )
        builder.addCase(clearMessage.fulfilled, (state) => {
            state.text = null
            state.error = false
        })
    },
})
// export const { clearMessage } = messageSlice.actions

export default messageSlice.reducer as Reducer<typeof initialMessageState>
