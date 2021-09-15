import './Styles.css';
import React, { Suspense, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import history from './helpers/history';
import Routes from './routes/Routes';
import { CLEAR_MESSAGE } from './redux/actions/types';
import EventBus from './common/EventBus';
// import logout from './redux/actions/auth';
import allActions from './redux/actions';

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(allActions.auth.logout());
  }, [dispatch]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    history.listen((location) => {
      // clear message when changing location
      dispatch({ type: CLEAR_MESSAGE });
    });
  }, [dispatch]);

  useEffect(() => {
    EventBus.on('logout', () => {
      logOut();
    });
    return () => {
      EventBus.remove('logout');
    };
  }, [currentUser, dispatch, logOut]);

  return (
    <Suspense fallback="Loading...">
      <div className="app">
        <Routes />
      </div>
    </Suspense>
  );
};
export default App;
