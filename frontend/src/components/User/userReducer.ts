import {HashTable} from "../../utils/utils";
import {Profile} from "../Post/Post";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<any>;
};

export interface UserObject extends Profile {
}

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

export const usersReducer = usersSlice.reducer
export const usersActions = usersSlice.actions