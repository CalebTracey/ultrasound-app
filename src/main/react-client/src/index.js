import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import setupInterceptors from './service/setupInterceptors';
import store from './redux/store';
import './index.css';
import App from './App';

setupInterceptors(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
