import { AnyAction } from '@reduxjs/toolkit'
import { SET_MESSAGE, CLEAR_MESSAGE } from '../actions/types'

interface MessageState {
    message: string
}

const initialState: MessageState = {
    message: '',
}

type IResponseType = { message: string }

const message = (state = initialState, action: AnyAction): IResponseType => {
    const { type, payload } = action

    switch (type) {
        case SET_MESSAGE:
            return { message: payload }

        case CLEAR_MESSAGE:
            return { message: '' }

        default:
            return state
    }
}

export default message
