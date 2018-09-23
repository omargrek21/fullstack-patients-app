import { apiCall } from "../../services/api";
import { LOAD_PATIENTS, RESET_PATIENTS, LOAD_BENEFICIARIES, RESET_BENEFICIARIES } from "../actionTypes";
import { addError, removeError } from "./errors";
import { queryResult, addPatients } from "./messages";

export const loadPatients = patients => ({
  type: LOAD_PATIENTS,
  patients
});

export const resetPatients = () => ({
  type: RESET_PATIENTS  
});

export const loadBeneficiaries = beneficiaries => ({
  type: LOAD_BENEFICIARIES,
  beneficiaries
});


export const resetBeneficiaries = () => ({
  type: RESET_BENEFICIARIES  
});


export const findPatients = dni => dispatch => {  
  return apiCall("get", `/api/patients/${dni}`)
    .then(res => {
        if(res.patients.length > 0){
          dispatch(loadPatients(res.patients));
          dispatch(queryResult('patients',null));
        }else {
          dispatch(queryResult('patients','Usuario no registrado'));
          dispatch(resetPatients());
        }
        if(res.beneficiaries.length > 0) {
          dispatch(loadBeneficiaries(res.beneficiaries));
          dispatch(queryResult('beneficiaries',null));
        }else {
          dispatch(queryResult('beneficiaries','N/A'));
          dispatch(resetBeneficiaries());
        }
        dispatch(removeError());
    })
    .catch(err => {
        dispatch(addError(err.message));
        dispatch(resetPatients());
        dispatch(resetBeneficiaries());
    });
};

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

