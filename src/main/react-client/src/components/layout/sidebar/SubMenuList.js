/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import React from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

// import SubMenuComponent from './SubMenuComponent';

const { SubMenu } = Menu;

const SubMenuList = () => {
  const { classifications } = useSelector((state) => state.data);

  const listNode = classifications.map((item) => (
    <SubMenu key={`sub${item.id}`} title={item.name}>
      <Menu.ItemGroup key={`ig${item.id}`} />
    </SubMenu>
  ));
  return <Menu.ItemGroup>{listNode}</Menu.ItemGroup>;
};

export default SubMenuList;
