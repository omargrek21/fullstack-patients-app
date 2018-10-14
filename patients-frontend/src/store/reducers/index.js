import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import patients from './patients';
import messages from './messages';
import beneficiaries from './beneficiaries';
import searchType from './searchType';
import loading from './loading';

const rootReducer = combineReducers({
   currentUser,
   errors,
   patients,
   beneficiaries,
   messages,
   searchType,
   loading
});

export default rootReducer;