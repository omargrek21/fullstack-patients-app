import { ADD_PATIENTS, QUERY_RESULT } from "../actionTypes";

const messages = (state = {message:null}, action) => {
  switch (action.type) {
    case ADD_PATIENTS:
      return {...state, message:action.message};
    case QUERY_RESULT:
      return({...state, [action.key]:action.message});
    default:
      return state;
  }
};

export default messages;