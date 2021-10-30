/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react'
import {
    UseFormRegister,
    UseFormHandleSubmit,
    SubmitHandler,
    FieldErrors,
    UseFormReset,
} from 'react-hook-form'

type TFormValues = {
    fullName: string
    username: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}
interface Props {
    successful: boolean
    message: string | null
    onSubmit: SubmitHandler<TFormValues>
    errors: FieldErrors<TFormValues>
    register: UseFormRegister<TFormValues>
    handleSubmit: UseFormHandleSubmit<TFormValues>
    reset: UseFormReset<TFormValues>
}
const RegisterForm: FC<Props> = ({
    successful,
    onSubmit,
    errors,
    register,
    handleSubmit,
    message,
    reset,
}) => (
    <div className="form">
        <span>
            <h4>Register</h4>
        </span>
        <div id="signup" className="register-form">
            <form id="signup" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="fullName">
                        Full Name
                        <input
                            defaultValue=""
                            type="text"
                            {...register('fullName')}
                            className={`form-control ${
                                errors.fullName ? 'is-invalid' : ''
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.fullName?.message}
                        </div>
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="username">
                        Username
                        <input
                            defaultValue=""
                            type="text"
                            {...register('username')}
                            className={`form-control ${
                                errors.username ? 'is-invalid' : ''
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.username?.message}
                        </div>
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        Email
                        <input
                            defaultValue=""
                            type="email"
                            {...register('email')}
                            className={`form-control ${
                                errors.email ? 'is-invalid' : ''
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.email?.message}
                        </div>
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        Password
                        <input
                            defaultValue=""
                            type="password"
                            {...register('password')}
                            className={`form-control ${
                                errors.password ? 'is-invalid' : ''
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.password?.message}
                        </div>
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">
                        Confirm Password
                        <input
                            defaultValue=""
                            type="password"
                            {...register('confirmPassword')}
                            className={`form-control ${
                                errors.confirmPassword ? 'is-invalid' : ''
                            }`}
                        />
                        <div className="invalid-feedback">
                            {errors.confirmPassword?.message}
                        </div>
                    </label>
                </div>

                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        {...register('acceptTerms')}
                        className={`form-check-input ${
                            errors.acceptTerms ? 'is-invalid' : ''
                        }`}
                    />
                    <span className="form-check-label">
                        I have read and agree to the Terms
                    </span>
                    <div className="invalid-feedback">
                        {errors.acceptTerms?.message}
                    </div>
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                        <span>Register</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="btn btn-warning float-right"
                        style={{ marginTop: '2rem' }}
                    >
                        <span>Reset</span>
                    </button>
                </div>
                {message && (
                    <div className="form-group">
                        <div
                            className={
                                successful
                                    ? 'alert alert-success'
                                    : 'alert alert-danger'
                            }
                            role="alert"
                        >
                            {message}
                        </div>
                    </div>
                )}
            </form>
        </div>
    </div>
)
export default RegisterForm
