/* eslint-disable react/prop-types */
import React from 'react';

const UserInfoHeader = ({ user }) => (
  <div style={{ fontSize: '1.35ch', color: '#6C757D' }} className="form-group">
    {user.email}
  </div>
);
export default UserInfoHeader;
