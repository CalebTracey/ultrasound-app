/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import React from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import SubMenuListItems from './SubMenuListItems';
// import SubMenuComponent from './SubMenuComponent';

const { SubMenu } = Menu;

const SubMenuList = () => {
  const { classifications } = useSelector((state) => state.data);

  const listNode = classifications.map((item) => (
    <SubMenu key={`sm-${item._id}`} title={item.name}>
      <SubMenuListItems listItems={item.listItems} />
    </SubMenu>
  ));
  return <Menu.ItemGroup>{listNode}</Menu.ItemGroup>;
};

export default SubMenuList;
