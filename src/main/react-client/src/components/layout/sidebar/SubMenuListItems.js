/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actions';

const SubMenuListItems = ({ data }) => {
  // const { data } = useSelector((state) => state.user.subMenu);
  const [itemListNode, setItemListNode] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      const listNode = data.itemList.map((item) => (
        <Menu.Item
          style={{ textTransform: 'capitalize' }}
          key={`mi${item.name}`}
          onClick={() => dispatch(allActions.user.selectedVideo(item))}
        >
          {item.name}
        </Menu.Item>
      ));
      setItemListNode(listNode);
      setIsLoading(false);
    }
    return () => {
      setIsLoading(false);
    };
  }, [dispatch, data]);

  return isLoading ? <Spin /> : <Menu.ItemGroup>{itemListNode}</Menu.ItemGroup>;
};

export default SubMenuListItems;
