import {HashTable, HashTableArray} from "../../utils/utils";
import AsyncStorage from "@react-native-community/async-storage";
import {persistReducer} from "redux-persist";
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
    query?: string;
};

const initialSearchState: SearchState = {
    users: {},
    queries: {},
    isSearching: false,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState: initialSearchState,
    reducers: {
        updateSearchQuery: (state, action: PayloadAction<{query: string}>) => {
            state.query = action.payload.query
        },
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

const persistConfig = {
    key: searchSlice.name,
    storage: AsyncStorage,
    blacklist: ['isSearching']
};

export const searchReducer = persistReducer(persistConfig, searchSlice.reducer)
export const searchActions = searchSlice.actions