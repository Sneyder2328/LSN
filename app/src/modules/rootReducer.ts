import {combineReducers} from "@reduxjs/toolkit";

import {authReducer, AuthState} from "./Auth/authReducer";
import {postsReducer, PostState} from "./Post/postsReducer";
import {newsFeedReducer, NewsFeedState} from "./NewsFeed/newsFeedReducer";
import {usersReducer, UsersState} from "./usersReducer";
import {commentsReducer, CommentsState} from "./Comment/commentsReducer";
import {profilesReducer, ProfilesState} from "./Profile/profilesReducer";
import {searchReducer, SearchState} from "./Search/searchReducer";

export interface MyAppState {
    auth: AuthState;
    newsFeed: NewsFeedState;
    search: SearchState;
    entities: {
        posts: PostState;
        users: UsersState;
        comments: CommentsState;
    },
    profiles: ProfilesState;
}

export const rootReducer = combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    entities: combineReducers({
        posts: postsReducer,
        users: usersReducer,
        comments: commentsReducer,
    }),
    profiles: profilesReducer
});