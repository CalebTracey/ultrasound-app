import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Body from '../components/layout/Body';
// import UserService from '../service/user-service';
// import EventBus from '../common/EventBus';
// import allActions from '../redux/actions';

// const { classifications } = UserService;

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    <Redirect to="login" />;
  }

  // useEffect(() => {
  //   if (classifications.length === 0) {
  //     dispatch(allActions.videos.classifications())
  //       .then((response) => {
  //         setClassificationsContent(response.data);
  //       })
  //       .catch((error) => {
  //         const err =
  //           (error.response &&
  //             error.response.data &&
  //             error.response.data.message) ||
  //           error.message ||
  //           error.toString();

  //         setClassificationsContent(err);

  //         if (error.response && error.response.status === 401) {
  //           EventBus.dispatch('logout');
  //         }
  //       });
  //   }
  // }, [dispatch, classifications]);

  return (
    <div className="app">
      <Sidebar />
      <Body user={user} />
    </div>
  );
};
export default withRouter(Dashboard);
