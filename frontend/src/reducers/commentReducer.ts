import {
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_ERROR,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS,
    LOAD_COMMENTS_ERROR
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
};
type loadCommentsSuccess = {
    type: 'LOAD_COMMENTS_SUCCESS';
    postId: string;
    newComments: Array<any>;
};
type loadCommentsError = {
    type: 'LOAD_COMMENTS_ERROR';
    postId: string;
};

export type CommentActions =
    createCommentRequest
    | createCommentSuccess
    | createCommentError
    | loadCommentsRequest
    | loadCommentsSuccess
    | loadCommentsError;

export const commentReducer = (state: PostState, action: CommentActions): PostState => {
    switch (action.type) {
        case CREATE_COMMENT_REQUEST:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, isCreatingComment: true};
                    return post;
                })
            };
        case CREATE_COMMENT_ERROR:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, isCreatingComment: false};
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
                            commentsCount: post.commentsCount + 1,
                            isCreatingComment: false
                        };
                    }
                    return post;
                })
            };
        case LOAD_COMMENTS_REQUEST:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, loadingPreviousComments: true};
                    return post;
                })
            };
        case LOAD_COMMENTS_ERROR:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, loadingPreviousComments: false};
                    return post;
                })
            };
        case LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId)
                        return {
                            ...post,
                            loadingPreviousComments: false,
                            comments: [...post.comments, ...action.newComments]
                        };
                    return post;
                })
            };
        default:
            return state;
    }
};