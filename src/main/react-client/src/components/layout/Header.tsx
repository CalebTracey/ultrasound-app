/* eslint-disable react/prop-types */
import React, { FC, useEffect, useState } from 'react'
import { Button, Alert } from 'reactstrap'
import Logout from '../buttons/LogoutButton'
import UserInfoHeader from '../UserInfoHeader'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { importData } from '../../redux/slices/edit'
import { clearMessage, newError, newMessage } from '../../redux/slices/message'
import { api } from '../../service/api'

const Header: FC = () => {
    const { message } = useAppSelector((state) => state)
    const { user } = useAppSelector((state) => state.auth)
    const [content, setContent] = useState<string | null>(null)
    const isAdmin = user.roles?.includes('ROLE_ADMIN')

    const dispatch = useAppDispatch()
    const handleImport = () => {
        dispatch(importData())
        dispatch(newMessage('Importing Data'))
    }

    useEffect(() => {
        const getDate = async () => {
            const date = await api.get(`date`)
            setContent(date.data)
        }
        getDate()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(clearMessage())
        }, 4000)
        return () => clearTimeout(timer)
    }, [message, dispatch])

    return (
        <header style={{ display: 'fixed' }}>
            {message.text && !message.error && (
                <Alert color="info">{message.text}</Alert>
            )}
            {message.text && message.error && (
                <Alert color="warn">{message.text}</Alert>
            )}
            {!message.text && (
                <div className="button-wrapper">
                    <div className="date">{content}</div>
                    {isAdmin && (
                        <div
                            className="form-group"
                            style={{ marginLeft: '1rem' }}
                        >
                            <Button color="warning" onClick={handleImport}>
                                Import
                            </Button>
                        </div>
                    )}

                    <Logout />
                    <UserInfoHeader user={user} />
                    {/* <SearchBar /> */}
                </div>
            )}
        </header>
    )
}

export default Header
