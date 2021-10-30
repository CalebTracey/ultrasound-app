/* eslint-disable react/prop-types */
import React, { useState, FC } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import LoginForm from '../components/login/LoginForm'
import HomeButton from '../components/buttons/HomeButton'
import RegisterButton from '../components/register/RegisterButton'
import { login } from '../redux/slices/auth'
import { newError } from '../redux/slices/message'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

type TFormValues = { username: string; password: string }

const Login: FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const message = useAppSelector((state) => state.auth.error)
    const dispatch = useAppDispatch()

    const resolver: Resolver<TFormValues> = async (values) => {
        return {
            values: values.username && values.password ? values : {},
            errors:
                !values.username && values.password
                    ? {
                          username: {
                              type: 'required',
                              message: 'Username is required.',
                          },
                          password: {
                              type: 'required',
                              message: 'Password is required.',
                          },
                      }
                    : {},
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TFormValues>({
        resolver,
        mode: 'onSubmit',
    })

    const onSubmit = (data: TFormValues) => {
        setIsLoading(true)
        try {
            dispatch(login(data)).then(() => {
                setIsLoading(false)
            })
        } catch (error: any) {
            dispatch(newError(error))
            setIsLoading(false)
        }
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
            />
        </>
    )
}

export default Login
