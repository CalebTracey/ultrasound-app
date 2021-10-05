/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
    console.log(
        `%c === Protected admin route === `,
        'font-size: 12px; color: black; background: lightGrey;'
    )
    const { isAuth, user } = useSelector((state) => state.auth)
    // console.log(Component)
    // console.log(user.roles)
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuth && user.roles.includes('ROLE_ADMIN')) {
                    return <Component {...props} />
                }
                return (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: props.history.location },
                        }}
                    />
                )
            }}
        />
    )
}

// ProtectedRouteAdmin.propTypes = {
//     component: PropTypes.func.isRequired,
// }

export default withRouter(ProtectedRouteAdmin)
