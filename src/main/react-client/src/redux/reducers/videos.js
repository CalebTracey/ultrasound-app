import { SET_CATEGORIES, SET_CLASSIFICATIONS } from '../actions/types';

const initialState = {
  categories: [],
  classifications: [],
};

const user = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CATEGORIES:
      return {
        ...state,
        categories: payload.data,
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

export default user;
