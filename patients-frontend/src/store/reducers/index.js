import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import patients from './patients';

const rootReducer = combineReducers({
   currentUser,
   errors,
   patients
});

export default rootReducer;