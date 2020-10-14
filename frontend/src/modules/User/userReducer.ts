import {HashTable} from "../../utils/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "../Auth/authReducer";
import {Profile} from "../../components/Post/Post";

const {logOutSuccess} = authActions

export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<any>;
};
export type RelationShipType =
    'friend'
    | 'pendingIncoming'
    | 'pendingOutgoing'
    | 'blockedIncoming'
    | 'blockedOutgoing'
    | undefined;

export interface UserObject extends Profile {
    relationship: RelationShipType;
    postsIds?: Array<string>;
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
            state.entities[action.payload.userId] = {
                ...state.entities[action.payload.userId],
                ...action.payload
            }
        },
        fetchProfileRequest: (state) => {

        },
        fetchProfileSuccess: (state, action: PayloadAction<{ userId: string; postIds: Array<string> }>) => {
            state.entities[action.payload.userId].postsIds = action.payload.postIds
        },
        fetchProfileError: (state) => {

        }
    },
    extraReducers: builder => {
        builder.addCase(logOutSuccess, _ => initialState)
    }
})

export const usersReducer = usersSlice.reducer
export const usersActions = usersSlice.actions