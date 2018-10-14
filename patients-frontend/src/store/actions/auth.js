import { apiCall, setTokenHeader } from "../../services/api";
import { SET_CURRENT_USER, SET_LOADING } from "../actionTypes";
import { addError, removeError } from "./errors";

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export const setLoading = loading => ({
  type: SET_LOADING,
  loading
});


export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function logout() {
  return dispatch => {
    localStorage.clear();
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
    dispatch(removeError());
  };
}

export function authUser(type, userData) {
  return dispatch => {
    dispatch(setLoading(true));
    dispatch(removeError());
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall("post", `/api/users/${type}`, userData)
        .then(({ token, ...user }) => {
          localStorage.setItem("jwtToken", token);
          setAuthorizationToken(token);
          dispatch(setCurrentUser(user));
          dispatch(removeError());
          dispatch(setLoading(false));
          resolve(); // indicate that the API call succeeded
        })
        .catch(err => {
          dispatch(addError(err.message));
          dispatch(setLoading(false));
          reject(); // indicate the API call failed
        });
    });
  };
}
