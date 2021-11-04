/* eslint-disable react/prop-types */
import React, { FC, lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAppSelector } from '../redux/hooks'

const Edit = lazy(() => import('../containers/Edit'))
const EditObject = lazy(() => import('../containers/EditObject'))
const VideoPlayer = lazy(() => import('../components/content/VideoPlayer'))
const Classification = lazy(() => import('../containers/Classification'))
const ContentHome = lazy(() => import('../components/content/ContentHome'))
const ProtectedRouteAdmin = lazy(() => import('./ProtectedRouteAdmin'))

interface Props {
    routePath: string
}

const ContentRoutes: FC<Props> = ({ routePath }) => {
    const { roles } = useAppSelector((state) => state.auth.user)

    const isAdmin = roles !== null && roles.includes('ROLE_ADMIN')
    return (
        <Suspense
            fallback={
                <div className="spinner">
                    <SyncLoader />
                </div>
            }
        >
            <Switch>
                <Route
                    path={`${routePath}/home`}
                    exact
                    component={ContentHome}
                />
                <Route
                    path={`${routePath}/classification/:id`}
                    component={Classification}
                />
                <ProtectedRouteAdmin
                    isAuthenticated={isAdmin}
                    path={`${routePath}/edit/:id`}
                    authenticationPath={`${routePath}`}
                    component={Edit}
                />
                <Route
                    path="/dashboard/admin/move/:id"
                    component={EditObject}
                />
                {/* <Route path="/dashboard/admin/edit/:id" component={Edit} /> */}
                {/* <ProtectedRoute
                        isAuthenticated={isAuth}
                        path=`${routePath}`
                        authenticationPath=`/login`
                        component={Dashboard}
                    /> */}
                <Route
                    path={`${routePath}/video/:id`}
                    component={VideoPlayer}
                />
                <Redirect
                    from={`${routePath}`}
                    to={`${routePath}/home`}
                    exact
                />
            </Switch>
        </Suspense>
    )
}

export default ContentRoutes
