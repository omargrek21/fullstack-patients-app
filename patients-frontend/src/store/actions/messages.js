import { ADD_PATIENTS, QUERY_RESULT } from "../actionTypes";

export const addPatients = message => ({
  type: ADD_PATIENTS,
  message
});

export const queryResult = (key,message) => ({
  type: QUERY_RESULT,
  message,
  key
});

