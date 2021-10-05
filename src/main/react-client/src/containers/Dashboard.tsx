import React, { useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import Sidebar from './Sidebar'
import Body from '../components/layout/Body'
import { getAll } from '../redux/slices/classification'
import EventBus from '../common/EventBus'

const Dashboard = () => {
    const { entities, loading } = useAppSelector(
        (state) => state.classification
    )
    const { isAuth } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isAuth) {
            EventBus.dispatch('logout')
        }
    }, [isAuth])

    const loadData = useCallback(() => {
        dispatch(getAll())
    }, [dispatch])

    useEffect(() => {
        if (entities.length === 0) {
            loadData()
        }
    }, [entities, loadData])
    return (
        <div className="app">
            {loading !== 'pending' && <Sidebar />}
            <Body />
        </div>
    )
}
export default withRouter(Dashboard)
