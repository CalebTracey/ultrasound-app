import api from './api'
import TokenService from './token-service'

const { removeUser } = TokenService

const userDetails = (username) => api.get(`auth/user/${username}`)

const registerService = (data) => api.post(`auth/sign-up`, data)

const loginService = (data) =>
    api.post(`auth/sign-in`, data).then((response) => {
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
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
