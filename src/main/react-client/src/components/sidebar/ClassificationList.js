/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import SyncLoader from 'react-spinners/SyncLoader';
import { SubMenu } from 'react-pro-sidebar';
import React from 'react';
import SubMenuItemGroup from './SubMenuItemGroup';
import ListItemGroup from './ListItemGroup';

const ClassificationList = ({ classifications }) => {
  const classificationListNode = classifications.map((classification) => {
    const { subMenus, listItems } = classification;
    return classifications.length > 0 ? (
      <>
        <SubMenu
          id={`sm-id${classification._id}`}
          style={{ textTransform: 'uppercase' }}
          key={`sm${classification._id}`}
          title={classification.name}
        >
          <SubMenuItemGroup
            key={`smig${classification._id}`}
            subMenus={subMenus}
          />
          <ListItemGroup
            key={`lig${classification._id}`}
            listItems={listItems}
          />
        </SubMenu>
      </>
    ) : (
      <SyncLoader />
    );
  });

  return classificationListNode;
};

export default ClassificationList;
