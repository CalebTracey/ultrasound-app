import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import videos from './videos';

export default combineReducers({
  auth,
  message,
  videos,
});
