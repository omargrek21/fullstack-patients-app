import { apiCall } from "../../services/api";
import { LOAD_PATIENTS, RESET_PATIENTS, LOAD_BENEFICIARIES, RESET_BENEFICIARIES, SET_TYPE, SET_LOADING } from "../actionTypes";
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

export const setType = mode => ({
  type: SET_TYPE,
  mode
});

export const setLoading = loading => ({
  type: SET_LOADING,
  loading
});

export const findPatients = dni => dispatch => {  
  dispatch(setLoading(true));
  dispatch(removeError());
  return apiCall("get", `/api/patients/${dni}`)
    .then(res => {
      const type = res.type;
      dispatch(setType(type));
      processData(res,dispatch);
      switch (type) {
        case "gps":
          dispatch(resetBeneficiaries());
          break;
        case "health":
          processTraditional(res,dispatch);
          break;
        default:
          processTraditional(res,dispatch);
      }
      dispatch(removeError());
      dispatch(setLoading(false));
    })
    .catch(err => {
        if(err){
          dispatch(addError(err.message));
        } else{
          dispatch(addError('El servidor no está respondiendo'));
        }
        dispatch(resetPatients());
        dispatch(resetBeneficiaries());
        dispatch(setLoading(false));
    });
};

export const uploadPatients = data => dispatch => {
  dispatch(setLoading(true));
  dispatch(removeError());
  return apiCall("post", "/api/patients", data)
    .then(res => {
      dispatch(addPatients(res));
      dispatch(removeError());
      dispatch(setLoading(false));
    })
    .catch(err => {
        dispatch(addError(err.message));
        dispatch(setLoading(false));
    });
};

const processData = (res,dispatch) => {
  if(res.patients.length > 0){
    dispatch(loadPatients(res.patients));
    dispatch(queryResult('patients',null));
  }else {
    dispatch(queryResult('patients','Usuario no registrado'));
    dispatch(resetPatients());
  }
};

const processTraditional = (res,dispatch) => {
  if(res.beneficiaries.length > 0) {
    dispatch(loadBeneficiaries(res.beneficiaries));
    dispatch(queryResult('beneficiaries',null));
  }else {
    dispatch(queryResult('beneficiaries','N/A'));
    dispatch(resetBeneficiaries());
  }
};

