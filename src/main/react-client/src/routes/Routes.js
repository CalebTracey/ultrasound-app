import React, { lazy } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from '../helpers/history';
import Dashboard from '../containers/Dashboard';

const Home = lazy(() => import('../containers/Home'));
const Login = lazy(() => import('../containers/Login'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const Register = lazy(() => import('../containers/Register'));

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path={['/', '/home']} component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} />
    </Switch>
  </Router>
);

export default Routes;
