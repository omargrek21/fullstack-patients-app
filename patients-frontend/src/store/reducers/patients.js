import { LOAD_PATIENTS, RESET_PATIENTS } from "../actionTypes";

const patients = (state = [], action) => {
  switch (action.type) {
    case LOAD_PATIENTS:
      console.log(action);
      return [...action.patients];
    case RESET_PATIENTS:
      return [];
    default:
      return state;
  }
};

export default patients;