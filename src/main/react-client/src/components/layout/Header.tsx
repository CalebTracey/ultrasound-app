/* eslint-disable react/prop-types */
import React, { FC, useEffect } from 'react'
import { Button, Alert } from 'reactstrap'
import Logout from '../buttons/LogoutButton'
import UserInfoHeader from '../UserInfoHeader'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { importData } from '../../redux/slices/edit'
import { clearMessage, newError, newMessage } from '../../redux/slices/message'

const Header: FC = () => {
    const { message } = useAppSelector((state) => state)
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const handleImport = () => {
        dispatch(importData())
        dispatch(newMessage('Importing Data'))
    }

    const isAdmin = user.roles?.includes('ROLE_ADMIN')
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(clearMessage())
        }, 5000)
        return () => clearTimeout(timer)
    }, [message, dispatch])
    return (
        <header style={{ display: 'fixed' }}>
            {message.text && <Alert color="info">{message.text}</Alert>}
            {!message.text && (
                <div className="button-wrapper">
                    {/* <div className="header-date">{content}</div> */}
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
