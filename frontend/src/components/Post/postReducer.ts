import {
    CREATE_POST_SUCCESS,
    CREATE_POST_REQUEST,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_REQUEST,
    CREATE_POST_ERROR, LOAD_POSTS_ERROR
} from "../../actions/types";
import {PostResponse} from "./Post";
import {CommentActions, commentReducer} from "../Comment/commentReducer";


export interface PostState {
    isLoadingPosts: boolean;
    isCreatingPost: boolean;
    posts: Array<PostResponse>;
}

const initialState: PostState = {
    isLoadingPosts: false,
    isCreatingPost: false,
    posts: []
};

type creatingPostAction = {
    type: 'CREATE_POST_REQUEST'
};
type postCreatedAction = {
    type: 'CREATE_POST_SUCCESS';
    postResponse: PostResponse
};
type postCreatedErrorAction = {
    type: 'CREATE_POST_ERROR'
};
export type LoadPostsRequest = {
    type: 'LOAD_POSTS_REQUEST'
};
export type LoadPostsSuccess = {
    type: 'LOAD_POSTS_SUCCESS';
    posts: Array<PostResponse>;
};
export type LoadPostsError = {
    type: 'LOAD_POSTS_ERROR';
};

export type PostActions =
    creatingPostAction
    | postCreatedAction
    | postCreatedErrorAction
    | LoadPostsRequest
    | LoadPostsSuccess
    | LoadPostsError
    | CommentActions;


export const postReducer = (state: PostState = initialState, action: PostActions): PostState => {
    switch (action.type) {
        case CREATE_POST_REQUEST:
            return {
                ...state,
                isCreatingPost: true
            };
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                isCreatingPost: false,
                posts: [...state.posts, action.postResponse]
            };
        case CREATE_POST_ERROR:
            return {
                ...state,
                isCreatingPost: false
            };
        case LOAD_POSTS_REQUEST:
            return {
                ...state,
                isLoadingPosts: true
            };
        case LOAD_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.posts || [],
                isLoadingPosts: false
            };
        case LOAD_POSTS_ERROR:
            return {
                ...state,
                isLoadingPosts: false
            };
        default:
            return commentReducer(state, action);
    }
};