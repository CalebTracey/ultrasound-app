import { SET_SELECTED_VIDEO } from './types';

const selectedVideo = (data) => ({
  type: SET_SELECTED_VIDEO,
  payload: data,
});

const user = { selectedVideo };

export default user;
