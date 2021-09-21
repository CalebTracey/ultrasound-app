// import {
//   SET_SELECTED_VIDEO,
//   SET_SUB_MENU,
//   SET_MESSAGE,
//   SET_SELECTED_CLASSIFICATION,
//   SET_VIDEO_TITLE,
// } from './types';
// import UserService from '../../service/user-service';

// const { getSubMenu } = UserService;

// const selectedVideo = (data) => ({
//   type: SET_SELECTED_VIDEO,
//   payload: data,
// });

// const selectedClassification = (data) => ({
//   type: SET_SELECTED_CLASSIFICATION,
//   payload: data,
// });

// const videoTitle = (data) => ({
//   type: SET_VIDEO_TITLE,
//   payload: data,
// });

// const subMenu = (id) => (dispatch) =>
//   getSubMenu(id).then(
//     (data) => {
//       dispatch({
//         type: SET_SUB_MENU,
//         payload: { data },
//       });
//       return Promise.resolve(data);
//     },
//     (error) => {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();

//       dispatch({
//         type: SET_MESSAGE,
//         payload: message,
//       });

//       return Promise.reject(error);
//     }
//   );

// const user = { videoTitle, selectedVideo, selectedClassification, subMenu };

// export default user;
