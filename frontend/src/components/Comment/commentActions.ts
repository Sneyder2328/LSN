import {CommentApi, CommentRequest} from "./commentApi";
import {
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_ERROR,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS,
    LOAD_COMMENTS_ERROR,
    SET_COMMENTS,
    INTERACT_COMMENT_REQUEST,
    INTERACT_COMMENT_SUCCESS,
    INTERACT_COMMENT_ERROR
} from "../../actions/types";
import {Actions} from "../../reducers";
import {CommentActions, CommentObject} from "./commentReducer";
import {normalize} from "normalizr";
import {comment} from "../../api/schema";
import {HashTable} from "../../utils/utils";

export const createComment = (commentData: CommentRequest) => async (dispatch: (actions: Actions) => any) => {
    try {
        dispatch({
            type: CREATE_COMMENT_REQUEST,
            postId: commentData.postId
        });
        const response = await CommentApi.createComment(commentData);
        const normalizedData = normalize(response.data, comment);
        console.log('createComment normalizedData=', normalizedData);
        // @ts-ignore
        dispatch(commentCreatedSuccess(normalizedData.entities['comments'][commentData.id] as CommentObject));
    } catch (err) {
        console.log(err);
        dispatch({
            type: CREATE_COMMENT_ERROR,
            postId: commentData.postId
        });
    }
};

export const loadPreviousComments = (postId: string, offset: number, limit: number = 10) => async (dispatch: (actions: Actions) => any) => {
    try {
        dispatch({type: LOAD_COMMENTS_REQUEST, postId});
        const response = await CommentApi.getComments(postId, offset, limit);
        const normalizedData = normalize(response.data, [comment]);
        console.log('loadPreviousComments normalizedData=', normalizedData);
        // @ts-ignore
        dispatch({
            type: LOAD_COMMENTS_SUCCESS,
            payload: {
                postId,
                // @ts-ignore
                newComments: normalizedData.entities['comments'],
                newCommentsIds: normalizedData.result
            }
        });
    } catch (err) {
        console.log(err);
        dispatch({type: LOAD_COMMENTS_ERROR, postId})
    }
};

const commentCreatedSuccess = (comment: CommentObject): Actions => {
    return {
        type: CREATE_COMMENT_SUCCESS,
        comment
    };
};

export const setComments = (comments: HashTable<CommentObject>): Actions => {
    return {
        type: SET_COMMENTS,
        comments
    };
};

export const likeComment = (commentId: string, undo: boolean) => async (dispatch: (actions: CommentActions) => any) => {
    console.log('likeComment', commentId, undo);
    const typeInteraction = undo ? "unlike" : "like";
    dispatch({type: INTERACT_COMMENT_REQUEST, commentId, typeInteraction});
    try {
        const likeInteraction = () => undo ? CommentApi.unlikeComment(commentId) : CommentApi.likeComment(commentId);
        const response = await likeInteraction();
        if (response.data)
            dispatch({type: INTERACT_COMMENT_SUCCESS, comment: response.data, typeInteraction});
        else
            dispatch({type: INTERACT_COMMENT_ERROR, commentId, typeInteraction});
    } catch (err) {
        console.log(err);
        dispatch({type: INTERACT_COMMENT_ERROR, commentId, typeInteraction});
    }
};

export const dislikeComment = (commentId: string, undo: boolean) => async (dispatch: (actions: CommentActions) => any) => {
    console.log('dislikeComment', commentId, undo);
    const typeInteraction = undo ? "undislike" : "dislike";
    dispatch({type: INTERACT_COMMENT_REQUEST, commentId, typeInteraction});
    try {
        const dislikeInteraction = () => undo ? CommentApi.undislikeComment(commentId) : CommentApi.dislikeComment(commentId);
        const response = await dislikeInteraction();
        if (response.data)
            dispatch({type: INTERACT_COMMENT_SUCCESS, comment: response.data, typeInteraction});
        else
            dispatch({type: INTERACT_COMMENT_ERROR, commentId, typeInteraction});
    } catch (err) {
        console.log(err);
        dispatch({type: INTERACT_COMMENT_ERROR, commentId, typeInteraction});
    }
};