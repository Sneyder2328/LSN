import {
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_ERROR,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS
} from "../actions/types";
import {PostState} from "./postReducer";
import {CommentResponse} from "../components/Home/NewsFeed/Comment";

type createCommentRequest = {
    type: 'CREATE_COMMENT_REQUEST';
    postId: string;
};
type createCommentSuccess = {
    type: 'CREATE_COMMENT_SUCCESS';
    postId: string;
    commentResponse: CommentResponse;
};
type createCommentError = {
    type: 'CREATE_COMMENT_ERROR';
    postId: string;
};
type loadCommentsRequest = {
    type: 'LOAD_COMMENTS_REQUEST'
    postId: string;
    comments?: Array<any>;
};
type loadCommentsSuccess = {
    type: 'LOAD_COMMENTS_SUCCESS';
    postId: string;
    comments: Array<any>;
};

export type CommentActions =
    createCommentRequest
    | createCommentSuccess
    | createCommentError
    | loadCommentsRequest
    | loadCommentsSuccess;

export const commentReducer = (state: PostState, action: CommentActions): PostState => {
    switch (action.type) {
        case CREATE_COMMENT_REQUEST:
        case CREATE_COMMENT_ERROR:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, createCommentStatus: action.type};
                    return post;
                })
            };
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) {
                        return {
                            ...post,
                            comments: [...post.comments, action.commentResponse],
                            createCommentStatus: action.type
                        };
                    }
                    return post;
                })
            };
        case LOAD_COMMENTS_REQUEST:
        case LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId)
                        return {
                            ...post,
                            fetchCommentsStatus: action.type,
                            comments: action.comments || []
                        };
                    return post;
                })
            };
        default:
            return state;
    }
};