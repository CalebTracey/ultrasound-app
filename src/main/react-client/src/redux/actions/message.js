import { SET_MESSAGE, CLEAR_MESSAGE } from './types';

const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});

const messages = {
  setMessage,
  clearMessage,
};

export default messages;
