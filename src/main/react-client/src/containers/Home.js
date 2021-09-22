import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LogoutButton from '../components/LogoutButton';
import LoginButton from '../components/login/LoginButton';
import RegisterButton from '../components/register/RegisterButton';
import DashboardButton from '../components/DashboardButton';
import UserService from '../service/user-service';

const { getPublicContent } = UserService;

const Home = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [content, setContent] = useState(null);

  useEffect(() => {
    getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const cont =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(cont.error);
      }
    );
    // .catch((err) => Promise.reject(err));
  }, []);

  return (
    <>
      <div className="header" style={{ left: '0', right: '0' }}>
        <div>
          <h1 className="text-center">Home</h1>
          <div className="button-wrapper">
            {isAuth ? (
              <>
                <LogoutButton />
                <DashboardButton />
              </>
            ) : (
              <>
                <LoginButton />
                <RegisterButton />
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="content"
        style={{
          left: '0',
          right: '0',
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
      >
        <div className="container">
          <header className="jumbotron">
            <h3>{content}</h3>
          </header>
        </div>
      </div>
      <div className="footer" style={{ left: '0', right: '0' }} />
    </>
  );
};

export default Home;
