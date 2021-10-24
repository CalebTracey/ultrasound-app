import React, { useState, useEffect, FC } from 'react'
import { Media, Jumbotron, Container } from 'reactstrap'
import axios from 'axios'
import LogoutButton from '../components/buttons/LogoutButton'
import LoginButton from '../components/login/LoginButton'
import RegisterButton from '../components/register/RegisterButton'
import DashboardButton from '../components/buttons/DashboardButton'
import { useAppSelector } from '../redux/hooks'

const Home: FC = () => {
    const { isAuth } = useAppSelector((state) => state.auth)
    const [content, setContent] = useState(null)

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    }

    const instance = axios.create({
        // baseURL: `${process.env.PUBLIC_URL}/api/`,
        baseURL: 'http://localhost:8080/api/',
        headers,
        withCredentials: true,
    })
    useEffect(() => {
        const getDate = async () => {
            const date = await instance.get(`date`)
            setContent(date.data)
        }
        getDate()
    }, [instance])

    return (
        <>
            <header>
                <div className="button-wrapper">
                    {isAuth ? (
                        <>
                            <LogoutButton />
                            <DashboardButton />
                            <div className="header-date">{content}</div>
                        </>
                    ) : (
                        <>
                            <LoginButton />
                            <RegisterButton />
                            <div className="header-date">{content}</div>
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
