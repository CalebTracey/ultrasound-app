import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';

const SearchBar = () => (
  <div className="search-bar">
    <InputGroup>
      <Input />
      <InputGroupAddon addonType="append">
        <Button color="secondary">Search</Button>
      </InputGroupAddon>
    </InputGroup>
  </div>
);

export default SearchBar;
