import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import data from './data';
import user from './user';

export default combineReducers({
  auth,
  message,
  data,
  user,
});
