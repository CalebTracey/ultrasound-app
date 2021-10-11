import React, { FC, useEffect, useCallback } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './redux/hooks'
// import history from './helpers/history'
import EventBus from './common/EventBus'
import Routes from './routes/Routes'
import './styles.scss'
import { logout } from './redux/slices/auth'
import { clearAll } from './redux/slices/message'
import { IAppUser } from './schemas'

const App: FC = () => {
    const { isAuth, loading, user, contentPath } = useAppSelector(
        (state) => state.auth
    )
    const dispatch = useAppDispatch()
    const history = useHistory()
    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const isAdmin = isUser(user) && user.roles?.includes('ROLE_ADMIN')

    const logOut = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    useEffect(() => {
        history.listen((location) => {
            clearAll()
        })
    }, [dispatch, history])

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
            // dispatch(loginSuccess(user))
            history.push(contentPath)
        } else {
            // history.push('/home')
        }
    })

    return (
        // <div style={{ boxSizing: 'border-box', minHeight: '100vh' }}>
        <Routes />
        // </div>
    )
}
export default App
