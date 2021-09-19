/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu } from 'antd';
import ReactPlayer from 'react-player';
import allActions from '../../../redux/actions';
// import SubMenuListItem from './SubMenuListItem';

const { SubMenu } = Menu;

const SubMenuComponent = ({ subMenu }) => {
  const { _id, name } = subMenu;
  const [subMenuItems, setSubMenuItems] = useState([]);
  const [node, setNode] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (subMenu) {
      setIsLoading(true);
      dispatch(allActions.user.subMenu(_id)).then((res) => {
        setSubMenuItems(res.data);
      });
      if (subMenuItems) {
        const listNode = subMenuItems.map((item) => {
          if (ReactPlayer.canPlay(item.link)) {
            return (
              <Menu.Item
                style={{ textTransform: 'capitalize' }}
                key={item._id}
                item={item}
                title={item.name}
                onClick={() => dispatch(allActions.user.selectedVideo(item))}
              />
            );
          }
          return false;
        });

        setNode(listNode);
      }
    }
    return () => {
      setIsLoading(false);
    };
  }, [dispatch, subMenu, _id, subMenuItems]);

  const loadSubMenu = (id) => {
    setIsLoading(true);
    dispatch(allActions.user.subMenu(id)).then((res) => {
      setSubMenuItems(res.data);
    });
  };

  return isLoading ? (
    'Loading...'
  ) : (
    <SubMenu key={_id} title={name} onTitleClick={() => loadSubMenu(_id)}>
      {node}
    </SubMenu>
  );
};

export default SubMenuComponent;
