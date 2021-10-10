import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Media, Jumbotron, Container } from 'reactstrap'
import LogoutButton from '../components/buttons/LogoutButton'
import LoginButton from '../components/login/LoginButton'
import RegisterButton from '../components/register/RegisterButton'
import DashboardButton from '../components/buttons/DashboardButton'
import UserService from '../service/user-service'

const { getPublicContent } = UserService
const user = JSON.parse(localStorage.getItem('user'))

const Home = () => {
    const { isAuth } = useSelector((state) => state.auth)
    const [content, setContent] = useState(null)

    useEffect(() => {
        if (user) {
            getPublicContent().then(
                (response) => {
                    setContent(response.data)
                },
                (error) => {
                    const cont =
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                    setContent(cont.error)
                    console.log(cont.error)
                }
            )
        }
        // .catch((err) => Promise.reject(err));
    }, [])

    return (
        <>
            <header>
                <div className="button-wrapper">
                    {isAuth ? (
                        <>
                            <div className="header-date">{content}</div>
                            <LogoutButton />
                            <DashboardButton />
                        </>
                    ) : (
                        <>
                            <div className="header-date">{content}</div>

                            <LoginButton />
                            <RegisterButton />
                        </>
                    )}
                </div>
            </header>
            <div
                className="content"
                style={{
                    left: '0',
                    right: '0',
                    marginLeft: '1rem',
                    marginRight: '1rem',
                }}
            >
                <Jumbotron>
                    <Container>
                        <Media body>
                            <Media heading>
                                <div className="content___header">
                                    Maine Medical Center Emergency Ultrasound
                                    Training Application
                                </div>
                                <hr className="my-2" />
                            </Media>
                            <p className="content___text">
                                Please register and login to continue
                            </p>
                        </Media>
                    </Container>
                </Jumbotron>
            </div>
            <footer />
        </>
    )
}

export default Home
