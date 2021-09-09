/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';

const UserInfoHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return <div className="form-group">{user.username}</div>;
};

export default UserInfoHeader;
