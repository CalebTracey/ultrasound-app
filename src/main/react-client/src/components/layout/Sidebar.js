/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SyncLoader from 'react-spinners/SyncLoader';
import { Button } from 'reactstrap';
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
import '../custom.scss';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const { selectedVideo, selectedVideoTitle } = useSelector(
    (state) => state.data
  );
  const { classifications } = useSelector((state) => state.data);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBool, setDataBool] = useState(true);
  // const [retVal, setRetVal] = useState({});
  const dispatch = useDispatch();
  const { roles } = user;

  useEffect(() => {
    const getClassificationData = async () => {
      if (!isLoading && dataBool) {
        setIsLoading(true);
        dispatch(allActions.data.classifications())
          .then((res) => {
            if (res === undefined) {
              setDataBool(false);
              dispatch(allActions.message.setMessage('No Data'));
              setIsLoading(false);
            } else {
              setDataBool(true);
              setIsLoading(false);
            }
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
    setDataBool(true);
    setIsLoading(false);
  }, [dispatch, classifications, isLoading, dataBool]);

  // const clickHandler = (subMenus) => {
  //   dispatch(allActions.user.subMenus(subMenus));
  //   // dispatch(allActions.user.subMenu(item.subMenu._id)
  // };
  const handleSubMenuChange = () => {
    if (selectedVideo) {
      dispatch(allActions.data.selectedVideo({}));
    }
    if (selectedVideoTitle) {
      dispatch(allActions.data.videoTitle(''));
    }
  };

  const refresh = () => {
    setDataBool(true);
  };

  if (!dataBool && !isLoading && roles) {
    return (
      <div className="sidebar">
        <div className="sidebar-content">
          <ProSidebar width="16rem">
            <SidebarHeader>
              <p className="sidebar-header">Classifications</p>
            </SidebarHeader>
            <p className="sidebar-header">{message}</p>
            <Button color="primary" onClick={refresh}>
              Retry
            </Button>
          </ProSidebar>
        </div>
      </div>
    );
  }
  return dataBool && !isLoading && roles ? (
    <div className="sidebar">
      <div className="sidebar-content">
        <ProSidebar width="16rem" onToggle={handleSubMenuChange}>
          <SidebarHeader>
            <p className="sidebar-header">Classifications</p>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <ClassificationList
                classifications={classifications}
                handleSubMenuChange={handleSubMenuChange}
                roles={roles}
              />
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
  ) : (
    <div className="sidebar">
      <div className="sidebar-content">
        <ProSidebar width="16rem">
          <SidebarHeader>
            <p className="sidebar-header">Classifications</p>
          </SidebarHeader>
          <div className="spinner">
            <SyncLoader />
          </div>
        </ProSidebar>
      </div>
    </div>
  );
};

export default Sidebar;
