/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ProSidebar,
  Menu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';
import ClassificationList from '../sidebar/ClassificationList';
import EventBus from '../../common/EventBus';
import allActions from '../../redux/actions';
import { SET_MESSAGE } from '../../redux/actions/types';
import './custom.scss';

const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { classifications } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const getClassificationData = async () => {
      if (!isLoading) {
        setIsLoading(true);
        dispatch(allActions.data.classifications()).catch((error) => {
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

          if (error.response && error.response.status === 401) {
            EventBus.dispatch('logout');
          }
          // setIsLoading(false);
        });
      }
    };
    if (classifications.length === 0 && !isLoading) {
      getClassificationData();
    }
    setIsLoading(false);
  }, [dispatch, classifications, isLoading]);

  // const clickHandler = (subMenus) => {
  //   dispatch(allActions.user.subMenus(subMenus));
  //   // dispatch(allActions.user.subMenu(item.subMenu._id)
  // };
  // const handleSubMenuChange = () => {
  //   dispatch(allActions.user.selectedVideo({}));
  //   dispatch(allActions.user.videoTitle(''));
  // };

  return isLoading ? (
    'Loading...'
  ) : (
    <div className="sidebar">
      <div className="sidebar-content">
        <ProSidebar width="16rem">
          <SidebarHeader>
            <p className="sidebar-header">Classifications</p>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <ClassificationList classifications={classifications} />
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <div className="sidebar-footer">
              <footer>
                <small>v0.5 {new Date().getFullYear()}</small>
              </footer>
            </div>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </div>
  );
};

export default Sidebar;
