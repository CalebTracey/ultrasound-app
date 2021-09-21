/* eslint-disable react/prop-types */
import React, { lazy } from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import history from '../helpers/history';
// import Classification from '../containers/Classification';

// const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const VideoPlayer = lazy(() => import('../components/content/VideoPlayer'));
const Classification = lazy(() => import('../containers/Classification'));
const ContentHome = lazy(() => import('../components/content/ContentHome'));

const ContentRoutes = ({ selectedVideo }) => (
  <Router history={history}>
    <Switch>
      <Route path="/dashboard/home" exact component={ContentHome} />
      <Route path="/dashboard/classification/:id" component={Classification} />
      <Route
        path="/dashboard/video/:id"
        render={() => <VideoPlayer selectedVideo={selectedVideo} />}
      />
      <Redirect from="/dashboard" to="/dashboard/home" exact />
    </Switch>
  </Router>
);

export default ContentRoutes;
