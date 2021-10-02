import React, { lazy, Suspense } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'
import history from '../helpers/history'

import Dashboard from '../containers/Dashboard'

const Home = lazy(() => import('../containers/Home'))
const Login = lazy(() => import('../containers/Login'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))
const Register = lazy(() => import('../containers/Register'))
// const Dashboard = lazy(() => import('../containers/Dashboard'))

const Routes = () => (
    <Suspense
        fallback={
            <div className="spinner">
                <SyncLoader />
            </div>
        }
    >
        <Router history={history}>
            <Switch>
                <Route exact path={['/', '/home']} component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
            </Switch>
        </Router>
    </Suspense>
)

export default Routes
