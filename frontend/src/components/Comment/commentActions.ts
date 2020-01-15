import {CommentApi, CommentRequest} from "./commentApi";
import {
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_ERROR,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS, LOAD_COMMENTS_ERROR, SET_COMMENTS
} from "../../actions/types";
import {Actions} from "../../reducers";
import {CommentObject} from "./commentReducer";
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
        dispatch({
            type: LOAD_COMMENTS_SUCCESS,
            payload: {
                postId,
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