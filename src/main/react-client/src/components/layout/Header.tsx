/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { FC, useEffect, useState, useCallback } from 'react'
import { Button, Alert } from 'reactstrap'
import Switch from 'react-switch'
import Logout from '../buttons/LogoutButton'
import UserInfoHeader from '../UserInfoHeader'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { importData } from '../../redux/slices/edit'
import { clearMessage } from '../../redux/slices/message'
import { api } from '../../service/api'
import { IAppUser } from '../../schemas'
import { userRegister, showEditToggle } from '../../redux/slices/auth'
import WarningModal from '../WarningModal'
import eventBus from '../../common/EventBus'

const Header: FC = () => {
    const { message, auth } = useAppSelector((state) => state)
    const { user, showEdit } = auth
    const [content, setContent] = useState<string | null>(null)
    const [modal, setModal] = useState(false)
    const [checked, setChecked] = useState(false)
    const dispatch = useAppDispatch()

    const handleChange = () => {
        dispatch(showEditToggle())
        setChecked(!checked)
    }

    const toggle = useCallback(() => {
        setModal(!modal)
        eventBus.dispatch('toggleEdit')
    }, [modal])

    const isAdmin = user.roles?.includes('ROLE_ADMIN')

    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const handleImport = () => {
        dispatch(importData())
        toggle()
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

    useEffect(() => {
        if (checked !== showEdit) {
            setChecked(showEdit)
        }
    }, [checked, showEdit])

    return (
        <>
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
                        {isAdmin && showEdit && (
                            <div
                                className="form-group"
                                style={{ marginLeft: '1rem' }}
                            >
                                <Button color="warning" onClick={toggle}>
                                    Import
                                </Button>
                            </div>
                        )}

                        <Logout />
                        {user.email && isUser(userRegister) && (
                            <UserInfoHeader email={user.email} />
                        )}
                        {isAdmin && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                }}
                            >
                                <label>
                                    <Switch
                                        height={14}
                                        width={28}
                                        handleDiameter={12}
                                        onChange={handleChange}
                                        checked={checked}
                                    />
                                </label>
                            </div>
                        )}
                        {/* <SearchBar /> */}
                    </div>
                )}
            </header>
            <WarningModal
                actionText="Reset the "
                itemText="database"
                setModal={modal}
                toggleCallback={toggle}
                modalAction={handleImport}
            />
        </>
    )
}

export default Header
