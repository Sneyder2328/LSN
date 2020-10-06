import {combineReducers} from 'redux';
import {authReducer, AuthState} from "../components/Auth/authReducer";
import {
    postsReducer,
    PostState
} from "../components/Post/postReducer";
import {newsFeedReducer, NewsFeedState} from "../components/NewsFeed/newsFeedReducer";
import {
    commentsReducer,
    CommentsState
} from "../components/Comment/commentReducer";
import {usersReducer, UsersState} from "../components/User/userReducer";
import {searchReducer, SearchState} from "../components/NavBar/searchReducer";
import {profilesReducer, ProfilesState} from "../components/UserProfile/profileReducer";

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
    profiles: ProfilesState;
}

export default combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducer,
    }),
    profiles: profilesReducer
});