import {
    POST_CREATED_SUCCESS,
    CREATING_POST,
    POSTS_FETCHED,
    FETCHING_POSTS,
    POST_CREATED_ERROR
} from "../actions/types";
import {PostResponse} from "../components/Home/NewsFeed/Post";
import {CommentActions, commentReducer} from "./commentReducer";


export interface PostState {
    createPostStatus: 'CREATING_POST' | 'POST_CREATED_SUCCESS' | 'POST_CREATED_ERROR' | '';
    fetchPostsStatus: 'FETCHING_POSTS' | 'POSTS_FETCHED' | '';
    posts: Array<PostResponse>;
}

const initialState: PostState = {
    createPostStatus: '',
    fetchPostsStatus: '',
    posts: []
};

type creatingPostAction = {
    type: 'CREATING_POST'
};
type postCreatedAction = {
    type: 'POST_CREATED_SUCCESS'
};
type postCreatedErrorAction = {
    type: 'POST_CREATED_ERROR'
};
type fetchingPostsAction = {
    type: 'FETCHING_POSTS'
    posts?: Array<PostResponse>;
};
type postsFetchedAction = {
    type: 'POSTS_FETCHED';
    posts: Array<PostResponse>;
};

export type Actions =
    creatingPostAction
    | postCreatedAction
    | postCreatedErrorAction
    | fetchingPostsAction
    | postsFetchedAction
    | CommentActions;


export const postReducer = (state: PostState = initialState, action: Actions): PostState => {
    switch (action.type) {
        case CREATING_POST:
        case POST_CREATED_SUCCESS:
        case POST_CREATED_ERROR:
            return {
                ...state,
                createPostStatus: action.type
            };
        case FETCHING_POSTS:
        case POSTS_FETCHED:
            return {
                ...state,
                fetchPostsStatus: action.type,
                posts: action.posts || []
            };
        default:
            return commentReducer(state, action);
    }
};