import axios from 'axios';

// const { REACT_APP_API_URL } = process.env;

const instance = axios.create({
  // baseURL: REACT_APP_API_URL,
  baseURL: 'http://localhost:8080/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

export default instance;
