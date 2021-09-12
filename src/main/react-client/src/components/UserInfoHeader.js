/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

const UserInfoHeader = ({ user }) => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
    // return () => {
    //   cleanup;
    // };
  }, [user]);

  return <div className="form-group">{username}</div>;
};

export default UserInfoHeader;
