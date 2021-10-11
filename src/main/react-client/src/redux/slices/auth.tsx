/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import axios from 'axios'
import AuthService from '../../service/auth-service'
import TokenService from '../../service/token-service'
import { IAppUser, IUserLogin } from '../../schemas'
// import { newError } from './message'
// import { api } from '../../service/api'
// import { isTSConstructSignatureDeclaration } from '@babel/types'

type TLogin = { username: string; password: string }
interface authSliceState {
    isAuth: boolean
    user: IAppUser | Record<string, null>
    loading: 'idle' | 'pending' | 'successful'
    error: string | null
    contentPath: '/dashboard' | '/dashboard/admin'
}

const instance = axios.create({
    // baseURL: REACT_APP_API_URL,
    baseURL: 'http://localhost:8080/api/',
    headers: {
        'Content-Type': 'application/json',
    },
})

const data: string | null = localStorage.getItem('user')
const user = data ? JSON.parse(data) : null

const initialAuthState: authSliceState = user
    ? {
          isAuth: true,
          user,
          loading: 'successful',
          error: null,
          contentPath: '/dashboard',
      }
    : {
          isAuth: false,
          user: {},
          loading: 'idle',
          error: null,
          contentPath: '/dashboard',
      }

const isUser = (value: unknown): value is IAppUser => {
    return !!value && !!(value as IAppUser)
}
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: TLogin) => {
        const res = await instance.post(`auth/sign-in`, credentials)
        return res.data
    }
)

export const logout = createAsyncThunk('auth/logout', async () => {
    return AuthService.logoutService()
})

export const userRegister = createAsyncThunk(
    'auth/register',
    async (credentials: TLogin) =>
        instance.post(`auth/sign-up`, credentials).then((res) => {
            const userData = res.data
            TokenService.setUser(userData)
            return Promise.resolve(userData)
        })
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        registerSuccess: (state, action: PayloadAction<IAppUser>) => {
            const userDetails = action.payload
            state.user = userDetails
            state.isAuth = true
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
                TokenService.setUser(userData)
                state.user = userData
                state.isAuth = true
                state.loading = 'successful'
                if (userData.roles.includes('ROLE_ADMIN')) {
                    state.contentPath = '/dashboard/admin'
                }
            } else {
                state.isAuth = false
                state.loading = 'idle'
                state.user = {}
                state.error = 'Login failed'
            }
        })
        builder.addCase(login.rejected, (state) => {
            state.isAuth = false
            state.user = {}
            state.loading = 'idle'
            state.error = 'Login failed - try again'
        })
        builder.addCase(userRegister.fulfilled, (state, action) => {
            const userData = action.payload
            if (isUser(userData)) {
                state.user = userData
                state.isAuth = true
                state.loading = 'successful'
                if (userData.roles.includes('ROLE_ADMIN')) {
                    state.contentPath = '/dashboard/admin'
                }
            } else {
                state.isAuth = false
                state.loading = 'idle'
                state.user = {}
                state.error = 'Registration failed'
            }
        })
        builder.addCase(userRegister.rejected, (state, action) => {
            state.isAuth = false
            state.loading = 'idle'
            state.user = {}
            state.error = 'Registration failed - username or email in use'
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuth = false
            state.loading = 'idle'
            state.user = {}
        })
    },
})
export const {
    // loginFail,
    registerSuccess,
    registerFail,
    // loginSuccess,
    // userLogout,
    userRefreshToken,
} = authSlice.actions

export default authSlice.reducer as Reducer<typeof initialAuthState>
