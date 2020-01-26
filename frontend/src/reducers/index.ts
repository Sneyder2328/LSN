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
import {SearchActions, searchReducer, SearchState} from "../components/NavBar/searchReducer";

type EntitiesState = {
    posts: PostState;
    comments: CommentsState;
    users: UsersState
};

export interface AppState {
    auth: AuthState;
    newsFeed: NewsFeedState
    entities: EntitiesState;
    search: SearchState;
}

export type Actions = PostActions | UserActions | CommentActions | SearchActions;

export default combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducers,
    })
});