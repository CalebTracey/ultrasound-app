import { AxiosResponse } from 'axios'
import { FC } from 'react'
import { api } from './api'
import TokenService from './token-service'

export type TUserDetails = {
    fullName: string
    username: string
    email: string
}
type TNewUser = {
    fullname: string
    username: string
    email: string
    password: string
}
type TUserLogin = {
    username: string
    password: string
}
type TUserLoginResponse = {
    accessToken: string
    email: string
    id: string
    roles: string[]
    tokenType: string
}
const { removeUser, setUser } = TokenService

const userDetails = async (username: string): Promise<TUserDetails> =>
    api.get(`auth/user/${username}`)

const registerService = async (data: TNewUser): Promise<string> =>
    api.post<TNewUser, string>(`auth/sign-up`, data)

const loginService = async (details: TUserLogin): Promise<TUserLoginResponse> =>
    api
        .post<TUserLogin, TUserLoginResponse>(`auth/sign-in`, details)
        .then((data) => {
            if (data) {
                setUser(data)
            }
            return Promise.resolve(data)
        })

const logoutService = () => {
    removeUser()
}

const AuthService = {
    userDetails,
    registerService,
    loginService,
    logoutService,
}

export default AuthService
