import React, { FC, useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import { FiXSquare } from 'react-icons/fi'
import { useLocation, useHistory } from 'react-router-dom'
import ContentRoutes from '../../routes/ContentRoutes'
import { useAppSelector } from '../../redux/hooks'
import { IAppUser } from '../../schemas'

const Content: FC = () => {
    const { isAuth, user, contentPath } = useAppSelector((state) => state.auth)
    const [routePath, setRoutePath] = useState('/dashboard')
    const location = useLocation()
    const history = useHistory()

    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const isAdmin = isUser(user) && user.roles?.includes('ROLE_ADMIN')

    useEffect(() => {
        if (isAdmin) {
            setRoutePath('/dashboard/admin')
        }
    }, [isAdmin])

    return isAuth && contentPath ? (
        <div className="content">
            {location.pathname !== `${contentPath}/home` && (
                <Button
                    style={{ position: 'absolute', zIndex: 1000 }}
                    onClick={() => history.push(contentPath)}
                >
                    <big>
                        <FiXSquare />
                    </big>
                </Button>
            )}
            <ContentRoutes routePath={routePath} />
        </div>
    ) : null
}
export default Content
