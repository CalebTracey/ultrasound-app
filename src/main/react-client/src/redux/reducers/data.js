import {
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  SET_CLASSIFICATIONS,
  SET_SELECTED_VIDEO,
  SET_SELECTED_SUB_MENU,
  SET_SELECTED_CLASSIFICATION,
  SET_VIDEO_TITLE,
} from '../actions/types';

const initialState = {
  classifications: [],
  selectedVideo: {},
  selectedSubMenus: new Map(),
  selectedClassification: '',
  selectedVideoTitle: '',
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
    case SET_SELECTED_SUB_MENU:
      return {
        ...state,
        // selectedSubMenus: [...state.selectedSubMenus, payload.data],
        // [selectedSubMenus.set(payload)],
      };
    case SET_SELECTED_CLASSIFICATION:
      return {
        ...state,
        selectedClassification: payload,
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
    default:
      return state;
  }
};

export default data;
