import { LOAD_BENEFICIARIES, RESET_BENEFICIARIES } from "../actionTypes";

const beneficiaries = (state = [], action) => {
  switch (action.type) {
    case LOAD_BENEFICIARIES:
      console.log(action);
      return [...action.beneficiaries];
    case RESET_BENEFICIARIES:
      return [];
    default:
      return state;
  }
};

export default beneficiaries;