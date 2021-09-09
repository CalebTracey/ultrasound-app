/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

const LoginForm = ({
  message,
  isLoading,
  onSubmit,
  errors,
  register,
  handleSubmit,
}) => (
  <div className="form">
    <label htmlFor="login">
      <h4>Log in</h4>
    </label>
    <div id="login" className="register-form">
      <form id="login" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            defaultValue=""
            name="username"
            type="text"
            {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            defaultValue=""
            name="password"
            type="password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading && <span className="spinner-border spinner-border-sm" />}
            <span>Login</span>
          </button>
        </div>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  </div>
);

export default LoginForm;
