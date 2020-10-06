import {HashTable, HashTableArray} from "../../utils/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type UserSearch = {
    userId: string;
    fullname: string;
    username: string;
    profilePhotoUrl: string;
};
export type SearchState = {
    users: HashTable<UserSearch>;
    queries: HashTableArray<string>;
    isSearching: boolean;
};

const initialSearchState: SearchState = {
    users: {},
    queries: {},
    isSearching: false
};

export const searchSlice = createSlice({
    name: 'search',
    initialState: initialSearchState,
    reducers: {
        searchUserRequest: (state) => {
            state.isSearching = true
        },
        searchUserSuccess: (state, action: PayloadAction<{
            users: HashTable<UserSearch>;
            query: string;
            queryResults: Array<string>;
        }>) => {
            state.isSearching = false
            state.queries = {
                ...state.queries,
                [action.payload.query]: action.payload.queryResults
            }
            state.users = {
                ...state.users,
                ...action.payload.users
            }
        },
        searchUserError: (state) => {
            state.isSearching = false
        }
    }
})

export const searchReducer = searchSlice.reducer
export const searchActions = searchSlice.actions