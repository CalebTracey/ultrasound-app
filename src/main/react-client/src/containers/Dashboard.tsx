import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Alert } from 'reactstrap'
import { useAppSelector } from '../redux/hooks'
import Sidebar from './Sidebar'
import Body from '../components/layout/Body'
import EventBus from '../common/EventBus'

const Dashboard = () => {
    const { isAuth } = useAppSelector((state) => state.auth)
    const { text, error } = useAppSelector((state) => state.message)

    useEffect(() => {
        if (!isAuth) {
            EventBus.dispatch('logout')
        }
    }, [isAuth])

    return isAuth ? (
        <div style={{ boxSizing: 'border-box', minHeight: '100vh' }}>
            {text && !error ? (
                <Alert color="info">{text}</Alert>
            ) : (
                <Alert color="danger">{text}</Alert>
            )}
            {/* <div style={{ boxSizing: 'border-box', minHeight: '100vh' }}> */}
            <Sidebar />
            <Body />
            {/* </div> */}
        </div>
    ) : (
        <>Dashboard Loading...</>
    )
}
export default withRouter(Dashboard)
