/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-props-no-spreading */
import { Redirect, Route, RouteProps } from 'react-router-dom'
import React, { FC } from 'react'

interface ProtectedRouteProps extends RouteProps {
    isAuthenticated: boolean
    isAdmin: boolean
    authenticationPath: string
}
const ProtectedRouteAdmin: FC<ProtectedRouteProps> = ({
    isAuthenticated,
    isAdmin,
    authenticationPath,
    ...routeProps
}: ProtectedRouteProps) => {
    if (isAuthenticated && isAdmin) {
        return <Route {...routeProps} />
    }
    return <Redirect to={{ pathname: authenticationPath }} />
}
export default ProtectedRouteAdmin

// const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
//     console.log(
//         `%c === Protected admin route === `,
//         'font-size: 12px; color: black; background: lightGrey;'
//     )
//     const { isAuth, user } = useSelector((state) => state.auth)
//     // console.log(Component)
//     // console.log(user.roles)
//     return (
//         <Route
//             {...rest}
//             render={(props) => {
//                 if (isAuth && user.roles.includes('ROLE_ADMIN')) {
//                     return <Component {...props} />
//                 }
//                 return (
//                     <Redirect
//                         to={{
//                             pathname: '/',
//                             state: { from: props.history.location },
//                         }}
//                     />
//                 )
//             }}
//         />
//     )
// }

// // ProtectedRouteAdmin.propTypes = {
// //     component: PropTypes.func.isRequired,
// // }

// export default withRouter(ProtectedRouteAdmin)
