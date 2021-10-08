import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Alert } from 'reactstrap'
import { useAppSelector } from '../redux/hooks'
import Sidebar from './Sidebar'
import Body from '../components/layout/Body'
// import { getAllClassifications } from '../redux/slices/classification'
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
        <>
            {text && !error ? (
                <Alert color="info">{text}</Alert>
            ) : (
                <Alert color="danger">{text}</Alert>
            )}
            <div className="app">
                <Sidebar />
                <Body />
            </div>
        </>
    ) : (
        <>Dashboard Loading...</>
    )
}
export default withRouter(Dashboard)
