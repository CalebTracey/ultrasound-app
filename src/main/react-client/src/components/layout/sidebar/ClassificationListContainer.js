/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import React from 'react';
import { Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
// import ClassificationItemListGroup from './ClassificationItemListGroup';
import ClassificationList from './ClassificationList';
// import SubMenuComponent from './SubMenuComponent';
import allActions from '../../../redux/actions';

const { SubMenu } = Menu;

const ClassificationListContainer = () => {
  const { classifications } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const listNode = classifications.map((item) => (
    <SubMenu
      key={`sm-${item._id}`}
      title={item.name.toUpperCase()}
      onTitleClick={() =>
        dispatch(allActions.user.selectedClassification(item))
      }
    >
      <ClassificationList classificationItem={item} />
    </SubMenu>
  ));
  return <Menu.ItemGroup>{listNode}</Menu.ItemGroup>;
};

export default ClassificationListContainer;
