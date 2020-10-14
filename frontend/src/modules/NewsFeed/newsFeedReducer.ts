import {createSlice} from "@reduxjs/toolkit";
import {authActions} from "../Auth/authReducer";
import {postActions} from "../Posts/postReducer";

const {
    loadPostsRequest, loadPostsSuccess, loadPostsError,
    createPostRequest, createPostSuccess, createPostError
} = postActions
const {logOutSuccess} = authActions

type NewsFeedList = {
    postIds: Array<string>
    isLoadingPosts: boolean
};

export interface NewsFeedState {
    isCreatingPost: boolean;
    top: NewsFeedList,
    latest: NewsFeedList
}

const initialStateNewsFeed: NewsFeedState = {
    isCreatingPost: false,
    latest: {
        isLoadingPosts: false,
        postIds: []
    },
    top: {
        isLoadingPosts: false,
        postIds: []
    }
};

const newsFeedSlice = createSlice({
    name: 'newsFeed',
    initialState: initialStateNewsFeed,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loadPostsSuccess, (state, action) => {
            state[action.payload.section] = {
                postIds: action.payload.allIds,
                isLoadingPosts: false
            }
        }).addCase(loadPostsRequest, (state, action) => {
            state[action.payload.section] = {
                ...state[action.payload.section],
                isLoadingPosts: true
            }
        }).addCase(loadPostsError, (state, action) => {
            state[action.payload.section] = {
                ...state[action.payload.section],
                isLoadingPosts: false
            }
        }).addCase(createPostRequest, (state, action) => {
            state.isCreatingPost = true
            state.latest = {
                ...state.latest,
                postIds: [action.payload.postId, ...state.latest.postIds]
            }
            state.top = {
                ...state.top,
                postIds: [action.payload.postId, ...state.top.postIds]
            }
        }).addCase(createPostSuccess, (state, action) => {
            state.isCreatingPost = false
        }).addCase(createPostError, (state, action) => {
            state.isCreatingPost = false
        }).addCase(logOutSuccess, _ => initialStateNewsFeed)
    }
})

export const newsFeedReducer = newsFeedSlice.reducer