/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actions';
// import SubMenuListItems from './SubMenuListItems';

const { SubMenu } = Menu;

const ClassificationSubMenuGroup = ({ allSubMenus }) => {
  const [subMenus, setSubMenus] = useState(null);
  const [subMenuItems, setSubMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allSubMenus) {
      const subMenuListNode = Object.keys(allSubMenus).map((key) => (
        <SubMenu
          key={`${allSubMenus[key]}`}
          title={key}
          children={subMenuItems}
          onTitleClick={() =>
            dispatch(allActions.user.subMenu(allSubMenus[key])).then((res) => {
              const menuItems = res.data.itemList.map((item) => (
                <Menu.Item
                  style={{ textTransform: 'capitalize' }}
                  key={item.link}
                  onClick={() => dispatch(allActions.user.selectedVideo(item))}
                >
                  {item.name}
                </Menu.Item>
              ));

              setSubMenuItems(menuItems);
            })
          }
        />
      ));
      setSubMenus(subMenuListNode);
    }

    return () => {
      setIsLoading(false);
    };
  }, [allSubMenus, dispatch, subMenuItems]);

  return subMenus && !isLoading ? (
    <Menu.ItemGroup>{subMenus}</Menu.ItemGroup>
  ) : null;
};

export default ClassificationSubMenuGroup;
