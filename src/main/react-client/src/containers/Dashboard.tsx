import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import Sidebar from './Sidebar'
import Body from '../components/layout/Body'
import EventBus from '../common/EventBus'

const Dashboard = () => {
    const { isAuth } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (!isAuth) {
            EventBus.dispatch('logout')
        }
    }, [isAuth])

    return (
        <div style={{ boxSizing: 'border-box', minHeight: '100vh' }}>
            <Sidebar />
            <Body />
        </div>
    )
}
export default withRouter(Dashboard)
