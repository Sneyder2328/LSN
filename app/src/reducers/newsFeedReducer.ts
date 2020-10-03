import {createSlice} from "@reduxjs/toolkit";
import {postsSlice} from "./postsReducer";

const {
    loadPostsRequest, loadPostsSuccess, loadPostsError,
    createPostRequest, createPostSuccess, createPostError
} = postsSlice.actions
import AsyncStorage from "@react-native-community/async-storage";
import {persistReducer} from "redux-persist";

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
        })
    }
})

const persistConfig = {
    key: newsFeedSlice.name,
    storage: AsyncStorage
};

export const newsFeedReducer = persistReducer(persistConfig, newsFeedSlice.reducer);