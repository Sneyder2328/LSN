import {PostActions} from "../reducers/postReducer";
import {CommentApi, CommentRequest} from "../api/comment";
import {COMMENT_CREATED_ERROR, COMMENT_CREATED_SUCCESS, CREATING_COMMENT} from "./types";
import {CommentResponse} from "../components/Home/NewsFeed/Comment";

/*
export const fetchComments = async (dispatch: (actions: Actions) => any) => {

};*/


export const createComment = (commentData: CommentRequest) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({
            type: CREATING_COMMENT,
            postId: commentData.postId
        });
        const response = await CommentApi.createComment(commentData);
        console.log('new comment response=', response);
        dispatch(commentCreatedSuccess(commentData, response.data as CommentResponse));
    } catch (err) {
        console.log(err);
        dispatch({
            type: COMMENT_CREATED_ERROR,
            postId: commentData.postId
        });
    }
};

const commentCreatedSuccess = (commentData: CommentRequest, commentResponse: CommentResponse): PostActions => {
    return {
        type: COMMENT_CREATED_SUCCESS,
        postId: commentData.postId,
        commentResponse
    };
};