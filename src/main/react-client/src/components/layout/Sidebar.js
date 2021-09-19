/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'antd';
import ClassificationListContainer from './Sidebar/ClassificationListContainer';
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

  // const clickHandler = (subMenus) => {
  //   dispatch(allActions.user.subMenus(subMenus));
  //   // dispatch(allActions.user.subMenu(item.subMenu._id)
  // };
  const handleSubMenuChange = () => {
    dispatch(allActions.user.selectedVideo({}));
    dispatch(allActions.user.videoTitle(''));
  };

  return isLoading ? (
    'Loading...'
  ) : (
    <div className="sidebar">
      <div className="sidebar-content">
        <Menu
          inlineIndent="20"
          triggerSubMenuAction="click"
          onOpenChange={() => handleSubMenuChange()}
          // theme="dark"
          // className="sidebar"
          mode="inline"
          style={{
            width: '15rem',
            // position: 'fixed',
            // top: '5rem',
            // backgroundColor: '#e9ecef',
          }}
        >
          <ClassificationListContainer />
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
