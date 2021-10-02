import React, { useEffect, useState } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SyncLoader from 'react-spinners/SyncLoader'
// import { Container } from 'reactstrap';
import Sidebar from '../components/layout/Sidebar'
import Body from '../components/layout/Body'
import UserService from '../service/user-service'

const { getPublicContent } = UserService

const Roles = ['ROLE_USER', 'ROLE_ADMIN']

const Dashboard = () => {
    const { roles } = useSelector((state) => state.auth.user)
    const [content, setContent] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasRoles, setHasRoles] = useState(false)

    useEffect(() => {
        const roleCheck = () => {
            if (roles) {
                const check = Roles.some((role) => roles.includes(role))
                setHasRoles(check)
            }
        }
        if (!isLoading && roles !== undefined) {
            setIsLoading(true)
            roleCheck()
            getPublicContent()
                .then(
                    (response) => {
                        setContent(response.data)
                    },
                    (error) => {
                        const cont =
                            (error.response && error.response.data) ||
                            error.message ||
                            error.toString()

                        setContent(cont.error)
                    }
                )
                .catch((err) => Promise.reject(err))
        }
        setIsLoading(false)
    }, [isLoading, roles])

    if (!hasRoles) {
        ;<Redirect to="login" />
    }

    return (
        // hasRoles && !isLoading ? (
        <div className="app">
            <Sidebar />
            <Body content={content} />
        </div>
        // ) : (
        //     <div className="spinner">
        //         <SyncLoader />
        //     </div>
    )
}
export default withRouter(Dashboard)
