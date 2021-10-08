import React, { FC, lazy, Suspense } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'
import history from '../helpers/history'

import Dashboard from '../containers/Dashboard'
import { useAppSelector } from '../redux/hooks'

const Home = lazy(() => import('../containers/Home'))
const Login = lazy(() => import('../containers/Login'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))
const Register = lazy(() => import('../containers/Register'))

const Routes: FC = () => {
    const { isAuth } = useAppSelector((state) => state.auth)
    return (
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
                    <ProtectedRoute
                        isAuthenticated={isAuth}
                        path="/dashboard"
                        authenticationPath="/login"
                        component={Dashboard}
                    />
                    )
                </Switch>
            </Router>
        </Suspense>
    )
}

export default Routes
