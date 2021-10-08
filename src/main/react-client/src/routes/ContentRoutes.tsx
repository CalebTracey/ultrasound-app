/* eslint-disable react/prop-types */
import React, { FC, lazy, Suspense } from 'react'
import { Route, Router, Switch, Redirect } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'
import history from '../helpers/history'
import { useAppSelector } from '../redux/hooks'
// import Edit from '../containers/Edit'
import { IAppUser } from '../schemas'

const Edit = lazy(() => import('../containers/Edit'))
const VideoPlayer = lazy(() => import('../components/content/VideoPlayer'))
const Classification = lazy(() => import('../containers/Classification'))
const ContentHome = lazy(() => import('../components/content/ContentHome'))
const ProtectedRouteAdmin = lazy(() => import('./ProtectedRouteAdmin'))

const ContentRoutes: FC = () => {
    const { isAuth, user } = useAppSelector((state) => state.auth)

    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const isAdmin = isUser(user) && user.roles.includes('ROLE_ADMIN')
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
                    <Route
                        path="/dashboard/home"
                        exact
                        component={ContentHome}
                    />
                    <Route
                        path="/dashboard/classification/:id"
                        component={Classification}
                    />
                    <ProtectedRouteAdmin
                        isAuthenticated={isAuth}
                        isAdmin={isAdmin}
                        path="/dashboard/edit/:id"
                        authenticationPath="/login"
                        component={Edit}
                    />
                    <Route
                        path="/dashboard/video/:id"
                        render={() => <VideoPlayer />}
                    />
                    <Redirect from="/dashboard" to="/dashboard/home" exact />
                </Switch>
            </Router>
        </Suspense>
    )
}

export default ContentRoutes
