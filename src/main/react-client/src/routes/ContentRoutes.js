/* eslint-disable react/prop-types */
import React, { lazy, Suspense } from 'react'
import { Route, Router, Switch, Redirect } from 'react-router-dom'
import SyncLoader from 'react-spinners/SyncLoader'
import history from '../helpers/history'
// import Edit from '../containers/Edit'

const Edit = lazy(() => import('../containers/Edit'))
const VideoPlayer = lazy(() => import('../components/content/VideoPlayer'))
const Classification = lazy(() => import('../containers/Classification'))
const ContentHome = lazy(() => import('../components/content/ContentHome'))
const ProtectedRouteAdmin = lazy(() => import('./ProtectedRouteAdmin'))

const ContentRoutes = ({ selectedVideo, selectedVideoUrl }) => (
    <Suspense
        fallback={
            <div className="spinner">
                <SyncLoader />
            </div>
        }
    >
        <Router history={history}>
            <Switch>
                <Route path="/dashboard/home" exact component={ContentHome} />
                <Route
                    path="/dashboard/classification/:id"
                    component={Classification}
                />
                <ProtectedRouteAdmin
                    path="/dashboard/edit/:id"
                    component={Edit}
                />
                <Route
                    path="/dashboard/video/:id"
                    render={() => (
                        <VideoPlayer
                            selectedVideo={selectedVideo}
                            selectedVideoList={selectedVideoUrl}
                        />
                    )}
                />
                <Redirect from="/dashboard" to="/dashboard/home" exact />
            </Switch>
        </Router>
    </Suspense>
)

export default ContentRoutes
