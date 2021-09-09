/* eslint-disable no-underscore-dangle */
import React from 'react';
import SidebarListItem from './SidebarListItem';

const SidebarList = ({ classifications }) => {
  const listNode = classifications.map((item) => (
    <SidebarListItem key={item._id} data={item.name} />
  ));

  return listNode;
};

export default SidebarList;
