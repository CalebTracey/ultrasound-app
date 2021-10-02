import {
    REFRESH_TOKEN,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from '../actions/types'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
    ? { isAuth: true, user }
    : { isAuth: false, user: null }

const auth = (state = initialState, action) => {
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
