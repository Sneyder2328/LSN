import {
    CREATE_COMMENT_SUCCESS,
    LOAD_COMMENTS_SUCCESS, SET_COMMENTS,
} from "../../actions/types";
import {HashTable} from "../../utils/utils";
import {Actions} from "../../reducers";

type SetComments = {
    type: 'SET_COMMENTS';
    comments: HashTable<CommentObject>
}
type CreateCommentRequest = {
    type: 'CREATE_COMMENT_REQUEST';
    postId: string;
};
type CreateCommentSuccess = {
    type: 'CREATE_COMMENT_SUCCESS';
    comment: CommentObject;
};
type CreateCommentError = {
    type: 'CREATE_COMMENT_ERROR';
    postId: string;
};
type LoadCommentsRequest = {
    type: 'LOAD_COMMENTS_REQUEST'
    postId: string;
};
type LoadCommentsSuccess = {
    type: 'LOAD_COMMENTS_SUCCESS';
    payload: {
        postId: string;
        newComments: HashTable<CommentObject>;
        newCommentsIds: Array<string>
    }
};
type LoadCommentsError = {
    type: 'LOAD_COMMENTS_ERROR';
    postId: string;
};

export type CommentActions =
    SetComments
    | CreateCommentRequest
    | CreateCommentSuccess
    | CreateCommentError
    | LoadCommentsRequest
    | LoadCommentsSuccess
    | LoadCommentsError;


export interface CommentObject {
    id: string;
    userId: string;
    postId: string;
    type: 'text' | 'img';
    text: string;
    img: string;
    createdAt: string;
    likesCount: number;
    dislikesCount: number;
    //currentUserLikeStatus: 'like' | 'dislike' | undefined;
}

export type CommentsState = {
    entities: HashTable<CommentObject>
};


export const initialCommentsState: CommentsState = {
    entities: {}
};

export const commentsReducer = (state: CommentsState = initialCommentsState, action: Actions): CommentsState => {
    switch (action.type) {
        case SET_COMMENTS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...action.comments
                }
            };
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.comment.id]: action.comment
                }
            };
        case LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...action.payload.newComments
                }
            };
        default:
            return state;
    }
};