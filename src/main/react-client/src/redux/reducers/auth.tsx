import { FC } from 'react'
import {
    REFRESH_TOKEN,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from '../actions/types'

interface IUser {
    id: string
    username: string
    email: string
    roles: string[]
    accessToken: string
    tokenType: string
}
interface IPayload {
    user: IUser
}

interface IAction {
    type: string
    payload: string | IUser
}

const data: string | null = localStorage.getItem('user')
const user = data ? JSON.parse(data) : null

const initialState = user
    ? { isAuth: true, user }
    : { isAuth: false, user: null }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const auth = (state = initialState, action: { type: any; payload?: any }) => {
    console.log(
        `%c Current action: %c${JSON.stringify(action.type)} `,
        'font-size: 12px; color: black; background: lightGrey;',
        'font-size: 12px; color: DarkGreen; background: lightGrey;'
    )
    const { type, payload } = action
    switch (type) {
        case REFRESH_TOKEN:
            return {
                ...state,
                user: { ...user, accessToken: payload },
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuth: false,
            }
        case REGISTER_FAIL:
            return {
                ...state,
                isAuth: false,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                user: payload.user,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                isAuth: false,
                user: null,
            }
        case LOGOUT:
            return {
                ...state,
                isAuth: false,
                user: null,
            }
        default:
            return state
    }
}

export default auth
