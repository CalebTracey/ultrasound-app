import { UPLOAD_FAIL, UPLOAD_SUCCESS, SET_MESSAGE } from './types';
import UploadService from '../../service/file-service';

const { uploadService } = UploadService;

const upload = (data) => (dispatch) =>
  uploadService(data).then(
    (response) => {
      dispatch({
        type: UPLOAD_SUCCESS,
        payload: {
          categories: response.categories,
          classifications: response.classifications,
        },
      });
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: UPLOAD_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject(error);
    }
  );

const serverOut = {
  upload,
};

export default serverOut;
