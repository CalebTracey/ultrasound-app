/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';

const UserInfoHeader = () => {
  const { email } = useSelector((state) => state.auth.user);
  // useEffect(() => {
  //   if (user) {
  //     setUsername(user.username);
  //   }
  // return () => {
  //   cleanup;
  // };
  // }, [user]);

  return (
    <div
      style={{ fontSize: '1.35ch', color: '#6C757D' }}
      className="form-group"
    >
      {email}
    </div>
  );
};

export default UserInfoHeader;
