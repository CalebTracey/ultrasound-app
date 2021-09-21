import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Sidebar from '../components/layout/Sidebar';
import Body from '../components/layout/Body';

// const Sidebar = lazy(() => import('../components/layout/Sidebar'));
// const Body = lazy(() => import('../components/layout/Body'));

// import UserService from '../service/user-service';
// import EventBus from '../common/EventBus';
// import allActions from '../redux/actions';

// const { classifications } = UserService;

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
