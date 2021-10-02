/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
// import { Button } from 'reactstrap';

const EditForm = ({
    successful,
    onSubmit,
    errors,
    register,
    handleSubmit,
    message,
    reset,
}) => (
    <div id="login" className="register-form">
        <form id="signup" onSubmit={() => handleSubmit(onSubmit)}>
            {/* <div className="form-group">
        <label htmlFor="classification">Classification</label>
        <input
          defaultValue=""
          name="classification"
          type="text"
          {...register('classification')}
          className={`form-control ${
            errors.classification ? 'is-invalid' : ''
          }`}
        />
        <div className="invalid-feedback">{errors.classification?.message}</div>
      </div>
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
        <label htmlFor="username">Email</label>
        <input
          defaultValue=""
          name="email"
          type="email"
          {...register('email')}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
        />
        <div className="invalid-feedback">{errors.email?.message}</div>
      </div>

      <div className="form-group">
        <label htmlFor="username">Password</label>
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
        <label htmlFor="username">Confirm Password</label>
        <input
          defaultValue=""
          name="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className={`form-control ${
            errors.confirmPassword ? 'is-invalid' : ''
          }`}
        />
        <div className="invalid-feedback">
          {errors.confirmPassword?.message}
        </div>
      </div> */}

            <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                    <span>Save</span>
                </button>
                {/* <Button
          style={{ marginTop: '2rem' }}
          type="button"
          color="warning"
          onClick={() => reset()}
        >
          <span>Reset</span>
        </Button> */}
                {/* <button
          type="button"
          onClick={() => reset()}
          className="btn btn-warning float-right"
          style={{ marginTop: '2rem' }}
        >
          <span>Reset</span>
        </button> */}
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
)

export default EditForm
