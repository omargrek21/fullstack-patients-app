import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import patients from './patients';
import messages from './messages';
import beneficiaries from './beneficiaries'

const rootReducer = combineReducers({
   currentUser,
   errors,
   patients,
   beneficiaries,
   messages
});

export default rootReducer;