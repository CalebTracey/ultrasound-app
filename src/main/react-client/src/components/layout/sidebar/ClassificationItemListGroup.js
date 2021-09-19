/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actions';

const ClassificationItemListGroup = ({ allListItems }) => {
  const [listItems, setListItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allListItems !== null && allListItems !== undefined) {
      const listItemNode = allListItems.map((item) => (
        <Menu.Item
          style={{ textTransform: 'capitalize' }}
          key={`mi${item.name}`}
          onClick={() => dispatch(allActions.user.selectedVideo(item))}
        >
          {item.name}
        </Menu.Item>
      ));
      setListItems(listItemNode);
    }

    return () => {
      setIsLoading(false);
    };
  }, [allListItems, dispatch]);

  return listItems && !isLoading ? (
    <Menu.ItemGroup>{listItems}</Menu.ItemGroup>
  ) : null;
};

export default ClassificationItemListGroup;
