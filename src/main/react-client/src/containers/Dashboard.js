import React, { useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Body from '../components/layout/Body';
import UserService from '../service/user-service';

const { getPublicContent } = UserService;

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState(null);

  useEffect(() => {
    getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const cont =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(cont.error);
      }
    );
    // .catch((err) => Promise.reject(err));
  }, []);

  if (!user) {
    <Redirect to="login" />;
  }

  return (
    <div className="app">
      <Sidebar />
      <Body user={user} content={content} />
    </div>
  );
};
export default withRouter(Dashboard);
