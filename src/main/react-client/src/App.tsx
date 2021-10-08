import React, { FC, useEffect, useCallback, ChangeEvent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './redux/hooks'
// import history from './helpers/history'
import EventBus from './common/EventBus'
import Routes from './routes/Routes'
import './Styles.css'
import { logout } from './redux/slices/auth'
import { clearAll } from './redux/slices/message'

interface Props {
    history: RouteComponentProps['history']
}

const App: FC<Props> = ({ history }) => {
    const { isAuth, loading } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

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
        if (isAuth && loading === 'successful') {
            history.push('/dashboard')
        }
    })

    return (
        <div className="app">
            <Routes />
        </div>
    )
}
export default App
