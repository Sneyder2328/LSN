import {
    COMMENT_CREATED_ERROR,
    COMMENT_CREATED_SUCCESS,
    COMMENTS_FETCHED,
    CREATING_COMMENT,
    FETCHING_COMMENTS
} from "../actions/types";
import {PostState} from "./postReducer";
import {CommentResponse} from "../components/Home/NewsFeed/Comment";

type creatingCommentAction = {
    type: 'CREATING_COMMENT';
    postId: string;
};
type commentCreatedAction = {
    type: 'COMMENT_CREATED_SUCCESS';
    postId: string;
    commentResponse: CommentResponse;
};
type commentCreatedErrorAction = {
    type: 'COMMENT_CREATED_ERROR';
    postId: string;
};
type fetchingCommentsAction = {
    type: 'FETCHING_COMMENTS'
    postId: string;
    comments?: Array<any>;
};
type commentsFetchedAction = {
    type: 'COMMENTS_FETCHED';
    postId: string;
    comments: Array<any>;
};

export type CommentActions =
    creatingCommentAction
    | commentCreatedAction
    | commentCreatedErrorAction
    | fetchingCommentsAction
    | commentsFetchedAction;

export const commentReducer = (state: PostState, action: CommentActions): PostState => {
    switch (action.type) {
        case CREATING_COMMENT:
        case COMMENT_CREATED_ERROR:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.postId) return {...post, createCommentStatus: action.type};
                    return post;
                })
            };
        case COMMENT_CREATED_SUCCESS:
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
        case FETCHING_COMMENTS:
        case COMMENTS_FETCHED:
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