/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import AuthService from '../../service/auth-service'

interface authSliceState {
    isAuth: boolean
    user: IAppUser | null
    loading: 'idle' | 'pending' | 'successful'
}
interface IAppUser {
    accessToken: string
    email: string
    id: string
    roles: string[]
    tokenType: string
}
interface TUserLogin {
    username: string
    password: string
}
const data: string | null = localStorage.getItem('user')
const user = data ? JSON.parse(data) : null
const initialAuthState: authSliceState = user
    ? { isAuth: true, user, loading: 'successful' }
    : { isAuth: false, user: null, loading: 'idle' }

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: TUserLogin) => {
        return AuthService.loginService(credentials)
    }
)
export const logout = createAsyncThunk('auth/logout', async () => {
    return AuthService.logoutService()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<IAppUser>) => {
            const userDetails = action.payload
            state.user = userDetails
            state.isAuth = true
        },
        loginFail: (state) => {
            state.isAuth = false
            state.user = null
        },
        registerSuccess: (state) => {
            state.isAuth = false
        },
        registerFail: (state) => {
            state.isAuth = false
        },
        // userLogout: (state) => {
        //     state = initialAuthState
        // },
        userRefreshToken: (state, action: PayloadAction<string>) => {
            const token = action.payload
            state.user = { ...user, accessToken: token }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload
            state.isAuth = true
            state.loading = 'successful'
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuth = false
            state.loading = 'idle'
            state.user = null
        })
    },
})
export const {
    loginFail,
    registerSuccess,
    registerFail,
    // userLogout,
    userRefreshToken,
} = authSlice.actions

export default authSlice
