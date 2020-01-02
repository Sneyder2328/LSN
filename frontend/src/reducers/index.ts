import { combineReducers } from 'redux';
import {authReducer} from "./authReducer";
import {postReducer} from "./postReducer";

export type AppState = {
    auth: any;
    post: any;
};

export default combineReducers({
    auth: authReducer,
    post: postReducer
});