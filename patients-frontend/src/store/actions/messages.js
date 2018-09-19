import { apiCall } from "../../services/api";
import { ADD_PATIENTS } from "../actionTypes";
import { addError, removeError } from "./errors";

export const addPatients = message => ({
  type: ADD_PATIENTS,
  message
});

export const uploadPatients = data => dispatch => {
  return apiCall("post", "/api/patients", data)
    .then(res => {
      dispatch(addPatients(res));
      dispatch(removeError());
    })
    .catch(err => {
        dispatch(addError(err.message));
    });
};