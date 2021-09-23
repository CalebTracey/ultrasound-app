import {
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  SET_CLASSIFICATIONS,
  SET_SELECTED_VIDEO,
  SET_SELECTED_CLASSIFICATION,
  SET_SELECTED_SUB_MENU,
  SET_VIDEO_TITLE,
  SELECTED_EDIT,
  USER_DATA,
  SET_URL,
} from '../actions/types';

const initialState = {
  classifications: [],
  selectedVideo: {},
  selectedVideoUrl: {},
  selectedEdit: {},
  selectedClassification: '',
  selectedVideoTitle: '',
  userData: {},
};

const data = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPLOAD_SUCCESS:
      return {
        ...state,
        classifications: payload.classifications,
      };
    case UPLOAD_FAIL:
      return {
        ...state,
        classifications: payload.data,
      };
    case SET_CLASSIFICATIONS:
      return {
        ...state,
        classifications: payload.data,
      };
    case SET_SELECTED_CLASSIFICATION:
      return {
        ...state,
        selectedClassification: payload,
      };
    case SET_SELECTED_SUB_MENU:
      return {
        ...state,
        // selectedSubMenus: [...state.selectedSubMenus, payload.data],
        // [selectedSubMenus.set(payload)],
      };
    case SET_SELECTED_VIDEO:
      return {
        ...state,
        selectedVideo: payload,
      };
    case SET_VIDEO_TITLE:
      return {
        ...state,
        selectedVideoTitle: payload,
      };
    case SELECTED_EDIT:
      return {
        ...state,
        selectedEdit: payload,
      };
    case USER_DATA:
      return {
        ...state,
        userData: payload.data,
      };
    case SET_URL:
      return {
        ...state,
        selectedVideoUrl: payload.data,
      };
    default:
      return state;
  }
};

export default data;
