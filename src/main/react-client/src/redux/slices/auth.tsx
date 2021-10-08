/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import AuthService from '../../service/auth-service'
import TokenService from '../../service/token-service'
import { IAppUser, IUserLogin } from '../../schemas'
import { api } from '../../service/api'

interface authSliceState {
    isAuth: boolean
    user: IAppUser | Record<string, null>
    loading: 'idle' | 'pending' | 'successful'
    error: string | null
}

const data: string | null = localStorage.getItem('user')
const user = data ? JSON.parse(data) : null
const initialAuthState: authSliceState = user
    ? { isAuth: true, user, loading: 'successful', error: null }
    : { isAuth: false, user: {}, loading: 'idle', error: null }

const isUser = (value: unknown): value is IAppUser => {
    return !!value && !!(value as IAppUser)
}
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: IUserLogin) =>
        api.post(`auth/sign-in`, credentials).then((res) => {
            const userData = res.data
            TokenService.setUser(userData)
            // if (isUser()) return res.data
            return userData
        })
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
            state.user = {}
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
            const userData = action.payload
            if (isUser(userData)) {
                state.user = userData
                state.isAuth = true
                state.loading = 'successful'
            } else {
                state.isAuth = false
                state.loading = 'idle'
                state.user = {}
                state.error = 'Login failed'
            }
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuth = false
            state.loading = 'idle'
            state.user = {}
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

export default authSlice.reducer as Reducer<typeof initialAuthState>
