/* eslint-disable react/prop-types */
import React from 'react';
import Logout from '../LogoutButton';
import UserInfoHeader from '../UserInfoHeader';
// import SearchBar from '../SearchBar';

const Header = ({ user, content }) => (
  <div className="header">
    <div className="button-wrapper">
      <div className="header-date">{content}</div>
      <Logout />
      <UserInfoHeader user={user} />
      {/* <SearchBar /> */}
    </div>
  </div>
);

export default Header;
