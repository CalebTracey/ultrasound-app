/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'antd';
import SubMenuList from './Sidebar/SubMenuList';
import EventBus from '../../common/EventBus';
import allActions from '../../redux/actions';
import { SET_MESSAGE } from '../../redux/actions/types';
import 'antd/dist/antd.css';

const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { classifications } = useSelector((state) => state.data);

  const dispatch = useDispatch();
  useEffect(() => {
    if (classifications.length === 0) {
      setIsLoading(true);
      dispatch(allActions.serverIn.classifications())
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          const err =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch({
            type: SET_MESSAGE,
            payload: err,
          });
          setIsLoading(false);
          if (error.response && error.response.status === 401) {
            EventBus.dispatch('logout');
          }
        });
    }
  }, [dispatch, classifications]);

  return isLoading ? (
    'Loading...'
  ) : (
    <div className="sidebar">
      <div className="sidebar-content">
        <Menu
          // className="sidebar"
          mode="inline"
          // style={{
          //   width: '12rem',
          //   position: 'fixed',
          //   top: '5rem',
          //   backgroundColor: '#e9ecef',
          // }}
        >
          <SubMenuList />
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
