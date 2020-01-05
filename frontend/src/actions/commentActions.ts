import {PostActions} from "../reducers/postReducer";
import {CommentApi, CommentRequest} from "../api/comment";
import {CREATE_COMMENT_REQUEST, CREATE_COMMENT_SUCCESS, CREATE_COMMENT_ERROR} from "./types";
import {CommentResponse} from "../components/Home/NewsFeed/Comment";

/*
export const fetchComments = async (dispatch: (actions: Actions) => any) => {

};*/


export const createComment = (commentData: CommentRequest) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({
            type: CREATE_COMMENT_REQUEST,
            postId: commentData.postId
        });
        const response = await CommentApi.createComment(commentData);
        console.log('new comment response=', response);
        dispatch(commentCreatedSuccess(commentData, response.data as CommentResponse));
    } catch (err) {
        console.log(err);
        dispatch({
            type: CREATE_COMMENT_ERROR,
            postId: commentData.postId
        });
    }
};

export const loadPreviousComments = (postId: string, offset: number, limit: number) => async (dispatch: (actions: PostActions) => any) => {
    
};

const commentCreatedSuccess = (commentData: CommentRequest, commentResponse: CommentResponse): PostActions => {
    return {
        type: CREATE_COMMENT_SUCCESS,
        postId: commentData.postId,
        commentResponse
    };
};