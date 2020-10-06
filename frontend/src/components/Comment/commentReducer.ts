import {createSelector} from 'reselect'
import {HashTable} from "../../utils/utils";
import {AppState} from "../../reducers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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

export const initialCommentsState: CommentsState = {
    entities: {},
    metas: {}
};

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: initialCommentsState,
    reducers: {
        loadCommentsRequest: (state, action: PayloadAction<{ postId: string }>) => {

        },
        loadCommentsSuccess: (state, action: PayloadAction<{
            postId: string;
            newComments: HashTable<CommentObject>;
            newCommentsIds: Array<string>
        }>) => {
            state.entities = {
                ...state.entities,
                ...action.payload.newComments
            }
        },
        loadCommentsError: (state, action: PayloadAction<{ postId: string }>) => {

        },
        setComments: (state, action: PayloadAction<HashTable<CommentObject>>) => {
            state.entities = {
                ...state.entities,
                ...action.payload
            }
        },
        createCommentRequest: (state, action: PayloadAction<{ postId: string }>) => {

        },
        createCommentSuccess: (state, action: PayloadAction<{ comment: CommentObject }>) => {
            state.entities[action.payload.comment.id] = action.payload.comment
        },
        createCommentError: (state, action: PayloadAction<{ postId: string }>) => {

        },
        interactCommentRequest: (state, action: PayloadAction<{ commentId: string; typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike'; }>) => {
            state.metas[action.payload.commentId] = {
                ...state.metas[action.payload.commentId],
                likeStatus: (action.payload.typeInteraction === "like" || action.payload.typeInteraction === "dislike") ? action.payload.typeInteraction : undefined
            }
        },
        interactCommentSuccess: (state, action: PayloadAction<{ comment: CommentObject; typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike'; }>) => {
            state.entities[action.payload.comment.id] = {
                ...state.entities[action.payload.comment.id],
                likeStatus: (action.payload.typeInteraction === "like" || action.payload.typeInteraction === "dislike") ? action.payload.typeInteraction : undefined,
                likesCount: action.payload.comment.likesCount,
                dislikesCount: action.payload.comment.dislikesCount,
            }
        },
        interactCommentError: (state, action: PayloadAction<{ commentId: string; typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike'; }>) => {
            state.metas[action.payload.commentId] = {
                ...state.metas[action.payload.commentId],
                likeStatus: undefined
            }
        }
    }
})

export const commentsReducer = commentsSlice.reducer
export const commentsActions = commentsSlice.actions

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