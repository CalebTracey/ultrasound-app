/* eslint-disable react/prop-types */
import React from 'react';
import Logout from '../LogoutButton';
import UserInfoHeader from '../UserInfoHeader';
// import SearchBar from '../SearchBar';

const Header = () => (
  <div className="header">
    <div className="button-wrapper">
      <Logout />
      <UserInfoHeader />
      {/* <SearchBar /> */}
    </div>
  </div>
);

export default Header;
