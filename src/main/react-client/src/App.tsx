import React, { FC, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './redux/hooks'
import EventBus from './common/EventBus'
import Routes from './routes/Routes'
import './styles.scss'
import { logout, loginSuccess } from './redux/slices/auth'
import { clearMessage } from './redux/slices/message'
import { IAppUser } from './schemas'

const App: FC = () => {
    const { isAuth, loading, user, contentPath } = useAppSelector(
        (state) => state.auth
    )
    const dispatch = useAppDispatch()
    const history = useHistory()
    const location = useLocation()
    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const logOut = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    useEffect(() => {
        dispatch(clearMessage())
    }, [location.pathname, dispatch])

    useEffect(() => {
        EventBus.on('logout', () => {
            logOut()
            history.push('/home')
        })
        return () => {
            EventBus.remove('logout', logOut)
        }
    }, [dispatch, logOut, history])

    useEffect(() => {
        if (isAuth && isUser(user) && loading === 'successful') {
            dispatch(loginSuccess(user))
            history.push(contentPath)
        } else {
            history.push('/home')
        }
    }, [dispatch, history, isAuth, loading, contentPath, user])

    return <Routes />
}
export default App
