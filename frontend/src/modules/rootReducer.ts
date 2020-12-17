import {combineReducers} from 'redux';
import {authReducer, AuthState} from "./Auth/authReducer";
import {newsFeedReducer, NewsFeedState} from "./NewsFeed/newsFeedReducer";
import {searchReducer, SearchState} from "./Search/searchReducer";
import {modalReducer, ModalState} from "./Modal/modalsReducer";
import {commentsReducer, CommentsState} from "./Comment/commentReducer";
import {usersReducer, UsersState} from "./User/userReducer";
import {postsReducer, PostState} from "./Posts/postReducer";
import {messagesReducer, MessagesState} from "./Messages/messagesReducer";
import {notificationsReducer, NotificationsState} from "./Notifications/notificationsReducer";

type EntitiesState = {
    posts: PostState;
    comments: CommentsState;
    users: UsersState;
};

export interface AppState {
    auth: AuthState;
    newsFeed: NewsFeedState
    entities: EntitiesState;
    search: SearchState;
    messages: MessagesState;
    modal: ModalState;
    notification: NotificationsState;
}

export const rootReducer = combineReducers({
    auth: authReducer,
    newsFeed: newsFeedReducer,
    search: searchReducer,
    modal: modalReducer,
    messages: messagesReducer,
    notification: notificationsReducer,
    entities: combineReducers({
        posts: postsReducer,
        comments: commentsReducer,
        users: usersReducer,
    }),
});