import {HashTable} from "../utils/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-community/async-storage";
import {persistReducer} from "redux-persist";
import {commentsSlice} from "./commentsReducer";

const {loadCommentsSuccess, loadCommentsError, loadCommentsRequest, createCommentError, createCommentRequest, createCommentSuccess} = commentsSlice.actions

export type PostImage = {
    url: string;
};

export interface PostObject {
    id: string;
    text: string;
    userId: string;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    createdAt: any;
    comments: Array<string>;
    images: Array<PostImage>;
    previewImages?: Array<File>;
    likeStatus: 'like' | 'dislike' | undefined;
}

export interface PostRequest {
    imageFiles: Array<File>;
    userId: string;
    id: string;
    text: string;
}

export interface PostMetadata {
    isLoadingPreviousComments?: boolean;
    isCreatingComment?: boolean;
    likeStatus: 'like' | 'dislike' | undefined;
    isUploading: boolean;
}

export type PostState = {
    entities: HashTable<PostObject>;
    metas: HashTable<PostMetadata>;
};

export const initialPostsState: PostState = {
    entities: {},
    metas: {}
};

export const postsSlice = createSlice({
    name: "posts",
    initialState: initialPostsState,
    reducers: {
        loadPostsRequest: (state, action: PayloadAction<{ section: 'top' | 'latest'; }>) => {

        },
        loadPostsSuccess: (state, action: PayloadAction<{
            posts: HashTable<PostObject>;
            section: 'top' | 'latest';
            allIds: Array<string>;
        }>) => {
            state.entities = {
                ...state.entities,
                ...action.payload.posts
            }
        },
        loadPostsError: (state, action: PayloadAction<{ section: 'top' | 'latest'; }>) => {

        },
        interactPostRequest: (state, action: PayloadAction<{ postId: string; typeInteraction: string }>) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                likeStatus: (action.payload.typeInteraction === "like" || action.payload.typeInteraction === "dislike") ? action.payload.typeInteraction : undefined
            }
        },
        interactPostSuccess: (state, action: PayloadAction<{
            post: {
                id: string;
                likesCount: number;
                dislikesCount: number;
            };
            typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
        }>) => {
            state.entities[action.payload.post.id] = {
                ...state.entities[action.payload.post.id],
                likeStatus: (action.payload.typeInteraction === "like" || action.payload.typeInteraction === "dislike") ? action.payload.typeInteraction : undefined,
                likesCount: action.payload.post.likesCount,
                dislikesCount: action.payload.post.dislikesCount
            }
        },
        interactPostError: (state, action: PayloadAction<{ postId: string; typeInteraction: string }>) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                likeStatus: undefined
            }
        },
        createPostRequest: (state, action: PayloadAction<{
            postId: string;
            text: string;
            imageFiles: Array<File>;
            userId: string;
        }>) => {
            state.metas[action.payload.postId] = {
                isLoadingPreviousComments: false,
                isCreatingComment: false,
                likeStatus: undefined,
                isUploading: true
            }
            state.entities[action.payload.postId] = {
                likeStatus: undefined,
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                createdAt: new Date().getTime(),
                id: action.payload.postId,
                text: action.payload.text,
                images: [],
                previewImages: action.payload.imageFiles.map((imgFile) => (imgFile)),
                userId: action.payload.userId
            }
        },
        createPostSuccess: (state, action: PayloadAction<{ postCreated: PostObject }>) => {
            state.entities[action.payload.postCreated.id] = action.payload.postCreated
            state.metas[action.payload.postCreated.id] = {
                ...state.metas[action.payload.postCreated.id],
                isUploading: false
            }
        },
        createPostError: (state, action: PayloadAction<{ error: string }>) => {

        }
    },
    extraReducers: builder => {
        builder.addCase(loadCommentsSuccess, (state, action) => {
            state.entities[action.payload.postId] = {
                ...state.entities[action.payload.postId],
                comments: [...action.payload.newCommentsIds, ...state.entities[action.payload.postId].comments]
            }
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                isLoadingPreviousComments: false
            }
        }).addCase(loadCommentsError, (state, action) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                isLoadingPreviousComments: false
            }
        }).addCase(loadCommentsRequest, (state, action) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                isLoadingPreviousComments: true
            }
        }).addCase(createCommentRequest, (state, action) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                isCreatingComment: true
            }
        }).addCase(createCommentError, (state, action) => {
            state.metas[action.payload.postId] = {
                ...state.metas[action.payload.postId],
                isCreatingComment: false
            }
        }).addCase(createCommentSuccess, (state, action) => {
            state.entities[action.payload.comment.postId] = {
                ...state.entities[action.payload.comment.postId],
                comments: [...state.entities[action.payload.comment.postId].comments, action.payload.comment.id],
                commentsCount: state.entities[action.payload.comment.postId].commentsCount + 1
            }
            state.metas[action.payload.comment.postId] = {
                ...state.metas[action.payload.comment.postId],
                isCreatingComment: false
            }
        })
    }
})

const persistConfig = {
    key: postsSlice.name,
    storage: AsyncStorage
};

export const postsReducer = persistReducer(persistConfig, postsSlice.reducer);