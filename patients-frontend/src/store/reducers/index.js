import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import patients from './patients';
import messages from './messages';

const rootReducer = combineReducers({
   currentUser,
   errors,
   patients,
   messages
});

export default rootReducer;