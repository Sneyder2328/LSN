import {PostActions} from "../reducers/postReducer";
import {CommentApi, CommentRequest} from "../api/comment";
import {
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_ERROR,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_ERROR
} from "./types";
import {CommentResponse} from "../components/Home/NewsFeed/Comment";

export const createComment = (commentData: CommentRequest) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({
            type: CREATE_COMMENT_REQUEST,
            postId: commentData.postId
        });
        const response = await CommentApi.createComment(commentData);
        dispatch(commentCreatedSuccess(commentData, response.data as CommentResponse));
    } catch (err) {
        console.log(err);
        dispatch({
            type: CREATE_COMMENT_ERROR,
            postId: commentData.postId
        });
    }
};

export const loadPreviousComments = (postId: string, offset: number, limit: number = 10) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({type: LOAD_COMMENTS_REQUEST, postId});
        const response = await CommentApi.getComments(postId, offset, limit);
        dispatch({type: LOAD_COMMENTS_SUCCESS, postId, newComments: response.data})
    } catch (err) {
        console.log(err);
        dispatch({type: LOAD_COMMENTS_ERROR, postId})
    }
};

const commentCreatedSuccess = (commentData: CommentRequest, commentResponse: CommentResponse): PostActions => {
    return {
        type: CREATE_COMMENT_SUCCESS,
        postId: commentData.postId,
        commentResponse
    };
};