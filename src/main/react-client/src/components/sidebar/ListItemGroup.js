/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { MenuItem } from 'react-pro-sidebar';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import allActions from '../../redux/actions';
import history from '../../helpers/history';

const ListItemGroup = ({ listItems }) => {
  const dispatch = useDispatch();

  const handleItemClick = (item) => {
    dispatch(allActions.data.videoTitle(item.title));
    dispatch(allActions.data.selectedVideo(item));
    history.push(`/dashboard/video/${item.name}`);
  };
  const subMenuGroup = listItems.map((item) => (
    <MenuItem
      // style={{ textTransform: 'uppercase' }}
      key={item.link}
      title={item.name}
      onClick={() => handleItemClick(item)}
    >
      {item.name}
    </MenuItem>
  ));
  return subMenuGroup;
};

ListItemGroup.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      link: PropTypes.string,
    })
  ).isRequired,
};

export default ListItemGroup;
