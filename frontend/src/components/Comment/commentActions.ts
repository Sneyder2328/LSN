import {normalize} from "normalizr";
import {comment} from "../../api/schema";
import {AppThunk} from "../../store";
import {CommentApi, CommentRequest} from "./commentApi";
import {CommentObject, commentsActions} from "./commentReducer";
const {
    createCommentRequest, createCommentError, loadCommentsRequest,
    createCommentSuccess, loadCommentsError, loadCommentsSuccess, interactCommentError,
    interactCommentRequest, interactCommentSuccess
} = commentsActions

export const createComment = (commentData: CommentRequest): AppThunk => async (dispatch) => {
    try {
        dispatch(createCommentRequest({postId: commentData.postId}));
        const response = await CommentApi.createComment(commentData);
        const normalizedData = normalize(response.data, comment);
        console.log('createComment normalizedData=', normalizedData);
        // @ts-ignore
        dispatch(createCommentSuccess({comment: normalizedData.entities['comments'][commentData.id] as CommentObject}));
    } catch (err) {
        console.log(err);
        dispatch(createCommentError({postId: commentData.postId}));
    }
};

export const loadPreviousComments = (postId: string, offset: number, limit: number = 10): AppThunk => async (dispatch) => {
    try {
        dispatch(loadCommentsRequest({postId}))
        const response = await CommentApi.getComments(postId, offset, limit);
        const normalizedData = normalize(response.data, [comment]);
        console.log('loadPreviousComments normalizedData=', normalizedData);
        // @ts-ignore
        dispatch(loadCommentsSuccess({
            postId,
            // @ts-ignore
            newComments: normalizedData.entities['comments'],
            newCommentsIds: normalizedData.result
        }));
    } catch (err) {
        console.log(err);
        dispatch(loadCommentsError({postId}))
    }
};


export const likeComment = (commentId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('likeComment', commentId, undo);
    const typeInteraction = undo ? "unlike" : "like";
    dispatch(interactCommentRequest({commentId, typeInteraction}));
    try {
        const likeInteraction = () => undo ? CommentApi.unlikeComment(commentId) : CommentApi.likeComment(commentId);
        const response = await likeInteraction();
        if (response.data)
            dispatch(interactCommentSuccess({comment: response.data, typeInteraction}));
        else
            dispatch(interactCommentError({commentId, typeInteraction}));
    } catch (err) {
        console.log(err);
        dispatch(interactCommentError({commentId, typeInteraction}));
    }
};

export const dislikeComment = (commentId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('dislikeComment', commentId, undo);
    const typeInteraction = undo ? "undislike" : "dislike";
    dispatch(interactCommentRequest({commentId, typeInteraction}));
    try {
        const dislikeInteraction = () => undo ? CommentApi.undislikeComment(commentId) : CommentApi.dislikeComment(commentId);
        const response = await dislikeInteraction();
        if (response.data)
            dispatch(interactCommentSuccess({comment: response.data, typeInteraction}));
        else
            dispatch(interactCommentError({commentId, typeInteraction}));
    } catch (err) {
        console.log(err);
        dispatch(interactCommentError({commentId, typeInteraction}));
    }
};