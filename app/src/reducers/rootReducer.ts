import {combineReducers} from "@reduxjs/toolkit";
import {authReducer, AuthState} from "./authReducer";
import {postsReducer, PostState} from "./postsReducer";
import {usersReducer, UsersState} from "./usersReducer";
import {newsFeedReducer, NewsFeedState} from "./newsFeedReducer";
import {commentsReducer, CommentsState} from "./commentsReducer";

export interface MyAppState {
    auth: AuthState;
    entities: {
        posts: PostState;
        newsFeed: NewsFeedState;
        users: UsersState;
        comments: CommentsState
    }
}

export const rootReducer = combineReducers({
    auth: authReducer,
    entities: combineReducers({
        posts: postsReducer,
        newsFeed: newsFeedReducer,
        users: usersReducer,
        comments: commentsReducer,
    }),
});