import { SET_TYPE } from '../actionTypes';

export default (state = {type:'traditional'}, action) => {
    switch(action.type){
        case SET_TYPE:
            return { type: action.mode };
        default:
            return state;
    }
};