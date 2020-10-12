import {HashTable} from "../../utils/utils";
import {Profile} from "../Post/Post";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "../Auth/authReducer";

const {logOutSuccess} = authActions

export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<any>;
};

export interface UserObject extends Profile {
    friendship: 'accepted' | 'pendingIncoming' | 'pendingOutgoing' | 'blockedIncoming' | 'blockedOutgoing' | undefined;
}

const initialState: UsersState = {
    entities: {},
    metas: {}
};

export const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
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
    },
    extraReducers: builder => {
        builder.addCase(logOutSuccess, _ => initialState)
    }
})

export const usersReducer = usersSlice.reducer
export const usersActions = usersSlice.actions