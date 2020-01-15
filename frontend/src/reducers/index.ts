import {combineReducers} from 'redux';
import {authReducer, AuthState} from "../components/Auth/authReducer";
import {
    PostActions,
    postsReducer,
    PostState
} from "../components/Post/postReducer";
import {newsFeedReducer, NewsFeedState} from "../components/NewsFeed/newsFeedReducer";
import {
    CommentActions,
    commentsReducer,
    CommentsState
} from "../components/Comment/commentReducer";
import { UserActions, usersReducers, UsersState} from "../components/User/userReducer";

type EntitiesState = {
    posts: PostState;
    comments: CommentsState;
    users: UsersState
};

export interface AppState {
    auth: AuthState;
    newsFeed: NewsFeedState
    entities: EntitiesState;
}

export type Actions = PostActions | UserActions | CommentActions;

export default combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducers,
    })
});