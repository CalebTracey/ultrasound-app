/* eslint-disable react/prop-types */
import React from 'react';
import Logout from '../LogoutButton';
import UserInfoHeader from '../UserInfoHeader';

const Header = () => (
  <div className="header">
    <div className="button-wrapper">
      <Logout />
      <UserInfoHeader />
    </div>
  </div>
);

export default Header;
