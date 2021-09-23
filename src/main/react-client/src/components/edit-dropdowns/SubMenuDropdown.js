/* eslint-disable react/prop-types */
import React from 'react';
import { DropdownMenu } from 'reactstrap';
import DropDownItemList from './DropdownItemsList';

const SubMenuDropdown = ({ setSubMenuSelection, subMenus }) => (
  <DropdownMenu
    modifiers={{
      setMaxHeight: {
        enabled: true,
        order: 890,
        fn: (data) => ({
          ...data,
          styles: {
            ...data.styles,
            overflow: 'auto',
            maxHeight: '10em',
          },
        }),
      },
    }}
  >
    <DropDownItemList
      setSelection={setSubMenuSelection}
      titles={Object.keys(subMenus)}
      links={Object.values(subMenus)}
    />
  </DropdownMenu>
);

export default SubMenuDropdown;
