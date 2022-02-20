/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-props-no-spreading */
import { Redirect, Route, RouteProps } from 'react-router-dom'
import React, { FC } from 'react'

interface ProtectedRouteProps extends RouteProps {
    isAuthenticated: boolean
    authenticationPath: string
}
const ProtectedRouteAdmin: FC<ProtectedRouteProps> = ({
    isAuthenticated,
    authenticationPath,
    ...routeProps
}: ProtectedRouteProps) => {
    if (isAuthenticated) {
        return <Route {...routeProps} />
    }
    return <Redirect to={{ pathname: authenticationPath }} />
}
export default ProtectedRouteAdmin
