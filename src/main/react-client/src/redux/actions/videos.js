import { SET_CATEGORIES, SET_CLASSIFICATIONS } from './types';
import VideoService from '../../service/video-service';

const { getClassifications } = VideoService;

const classifications = () => (dispatch) =>
  getClassifications().then((response) => {
    dispatch({
      type: SET_CLASSIFICATIONS,
      payload: response,
    });
  });

const categories = (data) => ({
  type: SET_CATEGORIES,
  payload: data,
});

const videos = { categories, classifications };

export default videos;
