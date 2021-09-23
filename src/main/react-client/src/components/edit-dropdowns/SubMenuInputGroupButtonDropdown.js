/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Input, InputGroupButtonDropdown, DropdownToggle } from 'reactstrap';
import SubMenuDropdown from './SubMenuDropdown';

const SubMenuInputGroupButtonDropdown = ({
  setSubMenuSelection,
  subMenus,
  selectedEdit,
  subMenuSelection,
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState);
  return (
    <>
      <InputGroupButtonDropdown
        addonType="prepend"
        disabled={!selectedEdit.hasSubMenu}
        isOpen={subMenuOpen}
        toggle={subMenuToggle}
      >
        <DropdownToggle caret>
          {`Sub Menus: ${Array.from(Object.keys(subMenus)).length}`}
        </DropdownToggle>
        <SubMenuDropdown
          setSubMenuSelection={setSubMenuSelection}
          subMenus={subMenus}
        />
      </InputGroupButtonDropdown>
      <Input
        style={{ textTransform: 'uppercase' }}
        defaultValue={subMenuSelection}
      />
    </>
  );
};

export default SubMenuInputGroupButtonDropdown;
