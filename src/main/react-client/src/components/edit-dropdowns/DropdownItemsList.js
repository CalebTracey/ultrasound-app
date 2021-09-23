import React from 'react';
import { DropdownItem } from 'reactstrap';

const DropdownItemList = ({ titles, links, setSelection }) => {
  console.log(links);
  const listNode = titles.map((title) => (
    <DropdownItem
      style={{ textTransform: 'uppercase' }}
      onClick={() => setSelection(title)}
    >
      {title}
    </DropdownItem>
  ));
  return listNode;
};

export default DropdownItemList;
