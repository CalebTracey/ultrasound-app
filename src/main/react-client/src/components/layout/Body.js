/* eslint-disable react/prop-types */
import React from 'react';
import Content from '../content/Content';
import Footer from './Footer';
import Header from './Header';

const Body = ({ content }) => (
  <div className="body">
    <Header content={content} />
    <Content />
    <Footer />
  </div>
);

export default Body;
