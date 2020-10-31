import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import {HashTable} from "../../utils/utils";
import {FriendRequestActionType} from "./userApi";
import {authActions} from "../Auth/authReducer";
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
export interface Profile {
    userId: string;
    coverPhotoUrl: string;
    profilePhotoUrl: string;
    description: string;
    fullname: string;
    username: string;
}
export interface UserObject extends Profile {
    relationship: RelationShipType;
    updatingRelationship?: boolean;
    postsIds?: Array<string>;
}

const initialState: UsersState = {
    entities: {},
    metas: {}
};

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<HashTable<UserObject>>) => {
            state.entities = {
                ...state.entities,
                ...action.payload
            }
        },
        setUser: (state, action: PayloadAction<UserObject>) => {
            console.log('setting the user as', action.payload);
            state.entities[action.payload.userId] = action.payload
        },
        fetchProfileRequest: (state) => {

        },
        fetchProfileSuccess: (state, action: PayloadAction<{ userId: string; postIds: Array<string>; username: string }>) => {
            state.entities[action.payload.userId].postsIds = action.payload.postIds
        },
        fetchProfileError: (state) => {

        },
        sendFriendRequestRequest: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.entities[action.payload.receiverId].updatingRelationship = true
        },
        sendFriendRequestSuccess: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.entities[action.payload.receiverId].updatingRelationship = false
            state.entities[action.payload.receiverId].relationship = 'pendingOutgoing'
        },
        sendFriendRequestError: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.entities[action.payload.receiverId].updatingRelationship = false
        },
        respondToFriendRequestRequest: (state, action: PayloadAction<{ senderId: string }>) => {
            state.entities[action.payload.senderId].updatingRelationship = true
        },
        respondToFriendRequestSuccess: (state, action: PayloadAction<{ senderId: string, action: FriendRequestActionType }>) => {
            state.entities[action.payload.senderId].updatingRelationship = false
            state.entities[action.payload.senderId].relationship = action.payload.action === 'confirm' ? 'friend' : undefined
        },
        respondToFriendRequestError: (state, action: PayloadAction<{ senderId: string }>) => {
            state.entities[action.payload.senderId].updatingRelationship = false
        }
    },
    extraReducers: builder => {
        builder.addCase(logOutSuccess, _ => initialState)
    }
})

const persistConfig = {
    key: usersSlice.name,
    storage: AsyncStorage
};

export const usersReducer = persistReducer(persistConfig, usersSlice.reducer)
export const usersActions = usersSlice.actions