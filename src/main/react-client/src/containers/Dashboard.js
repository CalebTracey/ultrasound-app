import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Sidebar from '../components/layout/Sidebar';
import Body from '../components/layout/Body';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    <Redirect to="login" />;
  }

  return (
    <div className="app">
      <Sidebar />
      <Body user={user} />
    </div>
  );
};
export default withRouter(Dashboard);
