import { combineReducers } from 'redux';
import {authReducer, AuthState} from "../components/Auth/authReducer";
import {postReducer, PostState} from "../components/Post/postReducer";

export type AppState = {
    auth: AuthState;
    post: PostState;
};

export default combineReducers({
    auth: authReducer,
    post: postReducer
});