import React from 'react';
import { Link } from 'react-router-dom';

const SidebarHome = () => (
  <Link to="/home">
    <div
      className="list-item"
      style={{
        color: 'black',
        backgroundColor: '#f8f9fa',
        borderRight: 'none',
      }}
    >
      Home
    </div>
  </Link>
);

export default SidebarHome;
