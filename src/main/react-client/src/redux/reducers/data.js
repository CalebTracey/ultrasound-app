import {
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  SET_CATEGORIES,
  SET_CLASSIFICATIONS,
} from '../actions/types';

const initialState = {
  categories: [],
  classifications: [],
};

const data = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPLOAD_SUCCESS:
      return {
        ...state,
        categories: payload.categories,
        classifications: payload.classifications,
      };
    case UPLOAD_FAIL:
      return {
        ...state,
        classifications: payload.data,
      };
    case SET_CATEGORIES:
      return {
        ...state,
        categories: payload,
      };
    case SET_CLASSIFICATIONS:
      return {
        ...state,
        classifications: payload.data,
      };
    default:
      return state;
  }
};

export default data;
