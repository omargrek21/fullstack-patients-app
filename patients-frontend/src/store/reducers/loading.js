import { SET_LOADING } from "../actionTypes";

const messages = (state = {loading:false}, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {...state, loading:action.loading};
    default:
      return state;
  }
};

export default messages;