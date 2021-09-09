import React, { useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Body from '../components/layout/Body';
import UserService from '../service/user-service';
import EventBus from '../common/EventBus';
import allActions from '../redux/actions';

const { getClassifications } = UserService;

const Dashboard = () => {
  const [content, setContent] = useState({});
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!user) {
    <Redirect to="login" />;
  }

  useEffect(() => {
    getClassifications().then(
      (response) => {
        dispatch(allActions.videos.classifications(response.data));
        setContent(response.data);
      },
      (error) => {
        const err =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(err);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch('logout');
        }
      }
    );
  }, [dispatch]);

  return (
    <div className="app">
      <Sidebar content={content} />
      <Body />
    </div>
  );
};
export default withRouter(Dashboard);
