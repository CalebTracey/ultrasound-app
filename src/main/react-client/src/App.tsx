import React, { FC, useEffect, useCallback, ChangeEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
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
    const { user: currentUser } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const logOut = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    useEffect(() => {
        history.listen((location) => {
            dispatch(clearAll())
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
    }, [currentUser, dispatch, logOut, history])

    return (
        <div className="app">
            <Routes />
        </div>
    )
}
export default App
