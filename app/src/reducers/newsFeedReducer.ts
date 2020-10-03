import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HashTable} from "../utils/utils";
import {PostObject, postsSlice} from "./postsReducer";
const {loadPostsRequest, loadPostsSuccess, loadPostsError} = postsSlice.actions
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
        builder.addCase(loadPostsSuccess, ((state, action) => {
            state[action.payload.section] = {
                postIds: action.payload.allIds,
                isLoadingPosts: false
            }
        })).addCase(loadPostsRequest, ((state, action) => {
            state[action.payload.section] = {
                ...state[action.payload.section],
                isLoadingPosts: true
            }
        })).addCase(loadPostsError, ((state, action) => {
            state[action.payload.section] = {
                ...state[action.payload.section],
                isLoadingPosts: false
            }
        }))
    }
})

const persistConfig = {
    key: newsFeedSlice.name,
    storage: AsyncStorage
};

export const newsFeedReducer = persistReducer(persistConfig, newsFeedSlice.reducer);