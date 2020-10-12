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
import {modalReducer, ModalState} from "../components/Modals/modalsReducer";

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
    profiles: ProfilesState;
}

export default combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    modal: modalReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducer,
    }),
    profiles: profilesReducer
});