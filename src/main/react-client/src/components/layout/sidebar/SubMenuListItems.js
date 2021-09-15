/* eslint-disable react/prop-types */
import React from 'react';
import { Menu } from 'antd';
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actions';

const SubMenuListItems = ({ listItems }) => {
  const dispatch = useDispatch();
  const listNode = listItems.map((item) => (
    <Menu.Item
      key={`mi${item.name}`}
      onClick={() => dispatch(allActions.user.selectedVideo(item))}
    >
      {item.name}
    </Menu.Item>
  ));
  return <Menu.ItemGroup>{listNode}</Menu.ItemGroup>;
};

export default SubMenuListItems;
