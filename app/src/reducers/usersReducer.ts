import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HashTable} from "../utils/utils";
import {persistReducer} from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

export interface UserObject {
    userId: string;
    coverPhotoUrl: string;
    profilePhotoUrl: string;
    description: string;
    fullname: string;
    username: string;
}

export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<any>;
};

export const initialUsersState: UsersState = {
    entities: {},
    metas: {}
};

export const usersSlice = createSlice({
    name: 'users',
    initialState: initialUsersState,
    reducers: {
        setUsers: (state, action: PayloadAction<HashTable<UserObject>>) => {
            state.entities = {
                ...state.entities,
                ...action.payload
            }
        },
        setUser: (state, action: PayloadAction<UserObject>) => {
            state.entities[action.payload.userId] = action.payload
        }
    }
})

const persistConfig = {
    key: usersSlice.name,
    storage: AsyncStorage
};

export const usersReducer = persistReducer(persistConfig, usersSlice.reducer)