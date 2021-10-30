type TUserLoginResponse = {
    accessToken: string
    email: string
    id: string
    roles: string[]
    tokenType: string
}

const getLocalRefreshToken = (): string | undefined => {
    const userStorage = localStorage.getItem('user')
    if (userStorage) {
        const user = JSON.parse(userStorage)
        return user.refreshToken
    }
    return undefined
}

const getLocalAccessToken = (): string | undefined => {
    const userStorage = localStorage.getItem('user')
    if (userStorage) {
        const user = JSON.parse(userStorage)
        return user.accessToken
    }
    return undefined
    // const user = JSON.parse(localStorage.getItem('user'))
    // console.log(`Get Token ${JSON.stringify(user.accessToken)}`)
    // return user?.accessToken
}

// const updateLocalAccessToken = (token: string) => {
//     const user = JSON.parse(localStorage.getItem('user'))
//     user.accessToken = token
//     localStorage.setItem('user', JSON.stringify(user))
// }

// const getUser = () => JSON.parse(localStorage.getItem('user'))

const setUser = (user: TUserLoginResponse): void => {
    localStorage.setItem('user', JSON.stringify(user))
}

const removeUser = (): void => {
    localStorage.removeItem('user')
}

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    // updateLocalAccessToken,
    // getUser,
    setUser,
    removeUser,
}

export default TokenService
