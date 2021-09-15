import axios from 'axios';

const instance = axios.create({
//  baseURL: 'http://localhost:8080/api',
    baseURL: 'http://backend/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

export default instance;
