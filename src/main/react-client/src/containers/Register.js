import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import RegisterForm from '../components/register/RegisterForm';
import allActions from '../redux/actions';
import LoginButton from '../components/login/LoginButton';
import HomeButton from '../components/HomeButton';

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Fullname is required'),
    username: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    if (Array.from(errors).length === 0) {
      dispatch(allActions.auth.register(data))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };
  return (
    <>
      <div className="button-wrapper">
        <LoginButton />
        <HomeButton />
      </div>
      <RegisterForm
        successful={successful}
        message={message}
        onSubmit={onSubmit}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        reset={reset}
      />
    </>
  );
};
export default Register;
