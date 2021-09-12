/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

const AddForm = ({
  successful,
  onSubmit,
  errors,
  register,
  handleSubmit,
  message,
  reset,
}) => (
  <div
    style={{
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      flexDirection: 'column',
      margin: 'auto',
    }}
  >
    {/* <label htmlFor="add-form">
      <h4>Log in</h4>
    </label> */}
    <div id="add-form" className="register-form">
      <form id="add-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
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
          <div className="invalid-feedback">
            {errors.classification?.message}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            defaultValue=""
            name="category"
            type="text"
            {...register('category')}
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.category?.message}</div>
        </div>

        <div className="form-group">
          <label htmlFor="subCategory">Subcategory</label>
          <input
            defaultValue=""
            name="subCategory"
            type="text"
            {...register('subCategory')}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="superCategory">Supercategory</label>
          <input
            defaultValue=""
            name="superCategory"
            type="text"
            {...register('superCategory')}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">
            <span>Submit</span>
          </button>
        </div>

        <div>
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
                successful ? 'alert alert-success' : 'alert alert-danger'
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
);

export default AddForm;
