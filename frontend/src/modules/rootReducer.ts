import {combineReducers} from 'redux';
import {authReducer, AuthState} from "./Auth/authReducer";
import {newsFeedReducer, NewsFeedState} from "./NewsFeed/newsFeedReducer";
import {searchReducer, SearchState} from "./Search/searchReducer";
import {modalReducer, ModalState} from "./Modal/modalsReducer";
import {commentsReducer, CommentsState} from "./Comment/commentReducer";
import {usersReducer, UsersState} from "./User/userReducer";
import {postsReducer, PostState} from "./Posts/postReducer";

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
    modal: ModalState;
}

export const rootReducer = combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    modal: modalReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducer,
    }),
});