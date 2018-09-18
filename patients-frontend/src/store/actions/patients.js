import { apiCall } from "../../services/api";
import { addError } from "./errors";
import { LOAD_PATIENTS, RESET_PATIENTS } from "../actionTypes";

export const loadPatients = patients => ({
  type: LOAD_PATIENTS,
  patients
});

export const resetPatients = () => ({
  type: RESET_PATIENTS  
});

export const reset = dispatch => (
   dispatch(resetPatients)      
);

export const findPatients = dni => dispatch => {  
  return apiCall("get", `/api/patients/${dni}`)
    .then(res => {
        dispatch(loadPatients(res));
    })
    .catch(err => {
        dispatch(addError(err.message));
    });
};
