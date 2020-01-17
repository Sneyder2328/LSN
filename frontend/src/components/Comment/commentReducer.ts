import {createSelector} from 'reselect'
import {
    CREATE_COMMENT_SUCCESS, INTERACT_COMMENT_ERROR,
    INTERACT_COMMENT_REQUEST,
    INTERACT_COMMENT_SUCCESS,
    LOAD_COMMENTS_SUCCESS,
    SET_COMMENTS,
} from "../../actions/types";
import {HashTable} from "../../utils/utils";
import {Actions, AppState} from "../../reducers";

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
    likeStatus: 'like' | 'dislike' | undefined;
}

export interface CommentMetadata {
    likeStatus: 'like' | 'dislike' | undefined;
}

export type CommentsState = {
    entities: HashTable<CommentObject>
    metas: HashTable<CommentMetadata>;
};

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

type InteractCommentRequest = {
    type: 'INTERACT_COMMENT_REQUEST';
    commentId: string;
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

type InteractCommentSuccess = {
    type: 'INTERACT_COMMENT_SUCCESS';
    comment: {
        id: string;
        likesCount: number;
        dislikesCount: number;
    };
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

type InteractCommentError = {
    type: 'INTERACT_COMMENT_ERROR';
    commentId: string;
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

export type CommentActions =
    SetComments
    | CreateCommentRequest
    | CreateCommentSuccess
    | CreateCommentError
    | LoadCommentsRequest
    | LoadCommentsSuccess
    | LoadCommentsError
    | InteractCommentRequest
    | InteractCommentSuccess
    | InteractCommentError;


export const initialCommentsState: CommentsState = {
    entities: {},
    metas: {}
};

export const commentsReducer = (state: CommentsState = initialCommentsState, action: Actions): CommentsState => {
    switch (action.type) {
        case INTERACT_COMMENT_REQUEST:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.commentId]: {
                        ...state.metas[action.commentId],
                        likeStatus: (action.typeInteraction === "like" || action.typeInteraction === "dislike") ? action.typeInteraction : undefined
                    }
                }
            };
        case INTERACT_COMMENT_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.comment.id]: {
                        ...state.entities[action.comment.id],
                        likeStatus: (action.typeInteraction === "like" || action.typeInteraction === "dislike") ? action.typeInteraction : undefined,
                        likesCount: action.comment.likesCount,
                        dislikesCount: action.comment.dislikesCount,
                    }
                }
            };
        case INTERACT_COMMENT_ERROR:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.commentId]: {
                        ...state.metas[action.commentId],
                        likeStatus: undefined
                    }
                }
            };
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

const selectCommentObject = (state: AppState, commentId: string) => {
    return state.entities.comments.entities[commentId];
};

const selectCommentAuthorObject = (state: AppState, commentId: string) => {
    return state.entities.users.entities[selectCommentObject(state, commentId).userId]
};

export const selectComment = () => createSelector([selectCommentObject, selectCommentAuthorObject],
    (commentObject, authorObject) => {
        return {
            ...commentObject,
            authorProfile: authorObject
        };
    }
);