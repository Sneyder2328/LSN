import {authReducer} from "./authReducer";
import {postReducer} from "./postReducer";


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