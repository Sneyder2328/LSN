import {PostActions} from "../reducers/postReducer";
import {CommentApi, CommentRequest} from "../api/comment";
import {COMMENT_CREATED_ERROR, COMMENT_CREATED_SUCCESS, CREATING_COMMENT} from "./types";

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
        console.log('new post response=', response);
        dispatch({
            type: COMMENT_CREATED_SUCCESS,
            postId: commentData.postId
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: COMMENT_CREATED_ERROR,
            postId: commentData.postId
        });
    }
};