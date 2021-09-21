/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import SubMenuComponent from './SubMenuComponent';

const SubMenuItemGroup = ({ subMenus }) => {
  const subMenuGroup = Object.keys(subMenus).map((subMenuKey) => (
    <SubMenuComponent
      key={subMenus[subMenuKey]}
      id={subMenus[subMenuKey]}
      title={subMenuKey}
    />
  ));
  return subMenuGroup;
};

SubMenuItemGroup.propTypes = {
  subMenus: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default SubMenuItemGroup;
