import { combineReducers } from 'redux';
import {authReducer, AuthState} from "./authReducer";
import {postReducer, PostState} from "./postReducer";

export type AppState = {
    auth: AuthState;
    post: PostState;
};

export default combineReducers({
    auth: authReducer,
    post: postReducer
});