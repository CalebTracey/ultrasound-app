import React, { FC, useEffect, useState } from 'react'
import { Jumbotron, Container } from 'reactstrap'
import SyncLoader from 'react-spinners/SyncLoader'
import ContentRoutes from '../../routes/ContentRoutes'
import { useAppSelector } from '../../redux/hooks'
import { IAppUser } from '../../schemas'

const Content: FC = () => {
    const { isAuth, user } = useAppSelector((state) => state.auth)
    const [routePath, setRoutePath] = useState('/dashboard')

    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const isAdmin = isUser(user) && user.roles?.includes('ROLE_ADMIN')

    useEffect(() => {
        if (isAdmin) {
            setRoutePath('/dashboard/admin')
        }
    }, [isAdmin])

    return isAuth ? (
        <div className="content">
            {/* <Jumbotron fluid style={{ maxHeight: '80vh', paddingTop: '2rem' }}> */}
            {/* <Container fluid> */}
            <ContentRoutes routePath={routePath} />
            {/* </Container> */}
            {/* </Jumbotron> */}
        </div>
    ) : (
        <div className="spinner">
            <SyncLoader />
        </div>
    )
}
export default Content
