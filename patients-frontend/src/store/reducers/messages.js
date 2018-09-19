import { ADD_PATIENTS } from "../actionTypes";

const messages = (state = {message:null}, action) => {
  switch (action.type) {
    case ADD_PATIENTS:
      return {...state, message:action.message};
    default:
      return state;
  }
};

export default messages;