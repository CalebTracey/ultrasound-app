/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import history from '../helpers/history'
import LoginForm from '../components/login/LoginForm'
import HomeButton from '../components/buttons/HomeButton'
import RegisterButton from '../components/register/RegisterButton'
import { login } from '../redux/slices/auth'

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const message = useSelector((state) => state.message.text)
    const { isAuth, user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),

        password: Yup.string().required('Password is required'),
    })
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        if (Array.from(errors).length === 0) {
            dispatch(login(data))
                .then(() => {
                    // console.log(res.data);
                    // if (res.data.roles) {
                    history.push('/dashboard')
                    // }
                })
                .catch(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }

    if (isAuth && user) {
        ;<Redirect to="/dashboard" />
    }

    return (
        <>
            <div className="button-wrapper">
                <HomeButton />
                <RegisterButton />
            </div>
            <LoginForm
                isLoading={isLoading}
                message={message}
                onSubmit={onSubmit}
                errors={errors}
                register={register}
                handleSubmit={handleSubmit}
                reset={reset}
            />
        </>
    )
}

export default Login
