import React, { useEffect, useState, FC, useCallback } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import EventBus from '../common/EventBus'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import Sidebar from './Sidebar'
import Body from '../components/layout/Body'
import allActions from '../redux/actions'

const Dashboard = () => {
    const { classifications } = useAppSelector((state) => state.data)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    const loadData = useCallback(() => {
        dispatch(allActions.edit.update())
    }, [dispatch])

    useEffect(() => {
        if (classifications.length === 0) {
            setIsLoading(true)
            loadData()
        }
        if (classifications) {
            setIsLoading(false)
        }
    }, [classifications, loadData])

    return (
        <div className="app">
            {!isLoading && <Sidebar />}
            <Body />
        </div>
    )
}
export default withRouter(Dashboard)
