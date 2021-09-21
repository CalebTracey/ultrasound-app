import {
  SET_CLASSIFICATIONS,
  SET_SELECTED_SUB_MENU,
  SET_SELECTED_CLASSIFICATION,
  SET_VIDEO_TITLE,
  SET_MESSAGE,
  SET_SELECTED_VIDEO,
} from './types';
import UserService from '../../service/user-service';

const { getClassifications, getSubMenu } = UserService;

const classifications = () => (dispatch) =>
  getClassifications().then(
    (data) => {
      dispatch({
        type: SET_CLASSIFICATIONS,
        payload: data,
      });
      // return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject(error);
    }
  );

const subMenu = (id) => (dispatch) =>
  getSubMenu(id).then(
    (data) => {
      dispatch({
        type: SET_SELECTED_SUB_MENU,
        payload: { data },
      });
      return Promise.resolve(data);
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject(error);
    }
  );

const selectedVideo = (data) => ({
  type: SET_SELECTED_VIDEO,
  payload: data,
});

const selectedClassification = (data) => ({
  type: SET_SELECTED_CLASSIFICATION,
  payload: data,
});

const videoTitle = (data) => ({
  type: SET_VIDEO_TITLE,
  payload: data,
});

const data = {
  classifications,
  subMenu,
  selectedVideo,
  selectedClassification,
  videoTitle,
};

export default data;
