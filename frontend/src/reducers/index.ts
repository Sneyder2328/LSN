import {authReducer} from "./authReducer";
import {postReducer} from "./postReducer";

export const TYPES = {
    SIGN_UP_ERROR: 'signUpError',
    LOG_IN_ERROR: 'logInError',
    SET_CURRENT_USER: 'setCurrentUser',
    SUBMITTING_POST: 'submittingPost',
    POST_CREATED: 'postCreated'
};

export type AppState = {
    auth: any;
    post: any;
};

export const mainReducer = ({auth, post}: AppState, action: any): AppState => {
    return {
        auth: authReducer(auth, action),
        post: postReducer(post, action)
    };
};