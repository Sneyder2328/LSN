import {HashTable} from "../../utils/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "../Auth/authReducer";
import {Profile} from "../../components/Post/Post";
import {FriendRequestActionType} from "./userApi";

export type UserSuggestion = { userId: string; relatedness: number };
export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<UserMetadata>;
    // contacts: Array<string>;
    suggestions: Array<UserSuggestion>
};
export type RelationshipType =
    'friend'
    | 'pendingIncoming'
    | 'pendingOutgoing'
    | 'blockedIncoming'
    | 'blockedOutgoing'
    | undefined;

export interface UserObject extends Profile {

}

// export interface UserObject extends Profile {
//     relationship: RelationshipType;
//     updatingRelationship?: boolean;
//     isOnline?: boolean;
//     postsIds?: Array<string>;
// }

export type PhotoObject = { id: string; url: string };

export interface UserMetadata {
    relationship?: RelationshipType;
    isOnline?: boolean;
    updatingRelationship?: boolean;
    postsIds?: Array<string>;
    friendsIds?: Array<string>;
    photos?: Array<PhotoObject>;
}

const initialState: UsersState = {
    entities: {},
    metas: {},
    // contacts: [],
    suggestions: []
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
        setUser: (state, action: PayloadAction<{ user: UserObject; meta?: UserMetadata }>) => {
            state.entities[action.payload.user.userId] = {
                ...state.entities[action.payload.user.userId],
                ...action.payload.user
            }
            state.metas[action.payload.user.userId] = {
                ...state.metas[action.payload.user.userId],
                ...action.payload.meta
            }
        },
        fetchProfileRequest: (state) => {

        },
        fetchProfileSuccess: (state, action: PayloadAction<{ userId: string; postIds: Array<string> }>) => {
            state.metas[action.payload.userId] = {
                ...state.metas[action.payload.userId],
                postsIds: action.payload.postIds
            }
        },
        fetchProfileError: (state) => {

        },
        fetchFriendsSuccess: (state, action: PayloadAction<{ userId: string; friends: Array<string> }>) => {
            state.metas[action.payload.userId] = {
                ...state.metas[action.payload.userId],
                friendsIds: action.payload.friends
            }
        },
        fetchPhotosSuccess: (state, action: PayloadAction<{ userId: string; photos: Array<PhotoObject> }>) => {
            state.metas[action.payload.userId] = {
                ...state.metas[action.payload.userId],
                photos: action.payload.photos
            }
        },
        sendFriendRequestRequest: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.metas[action.payload.receiverId] = {
                ...state.metas[action.payload.receiverId],
                updatingRelationship: true
            }
        },
        sendFriendRequestSuccess: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.metas[action.payload.receiverId] = {
                ...state.metas[action.payload.receiverId],
                updatingRelationship: false,
                relationship: 'pendingOutgoing'
            }
            state.suggestions = state.suggestions.filter(({userId}) => userId !== action.payload.receiverId)
        },
        sendFriendRequestError: (state, action: PayloadAction<{ receiverId: string }>) => {
            state.metas[action.payload.receiverId] = {
                ...state.metas[action.payload.receiverId],
                updatingRelationship: false
            }
        },
        respondToFriendRequestRequest: (state, action: PayloadAction<{ senderId: string }>) => {
            state.metas[action.payload.senderId] = {
                ...state.metas[action.payload.senderId],
                updatingRelationship: true
            }
        },
        respondToFriendRequestSuccess: (state, action: PayloadAction<{ senderId: string, action: FriendRequestActionType }>) => {
            state.metas[action.payload.senderId] = {
                ...state.metas[action.payload.senderId],
                updatingRelationship: false,
                relationship: action.payload.action === 'confirm' ? 'friend' : undefined
            }
            state.suggestions = state.suggestions.filter(({userId}) => userId !== action.payload.senderId)
        },
        respondToFriendRequestError: (state, action: PayloadAction<{ senderId: string }>) => {
            state.metas[action.payload.senderId] = {
                ...state.metas[action.payload.senderId],
                updatingRelationship: false
            }
        },
        removeFriendshipSuccess: (state, action: PayloadAction<{ userId: string }>) => {
            state.metas[action.payload.userId] = {
                ...state.metas[action.payload.userId],
                relationship: undefined
            }
        },
        fetchUserSuggestionsSuccess: (state, action: PayloadAction<{ suggestions: Array<UserSuggestion> }>) => {
            state.suggestions = action.payload.suggestions
        },
        removeUserSuggestedSuccess: (state, action: PayloadAction<{ userSuggestedId: string }>) => {
            state.suggestions = state.suggestions.filter((suggestion) => suggestion.userId !== action.payload.userSuggestedId)
        }
    },
    // extraReducers: builder => {
    //     builder.addCase(logOutSuccess, _ =>  initialState)
    // }
    extraReducers: {
        [authActions.logOutSuccess.type]: _ => initialState
    }
})

export const usersReducer = usersSlice.reducer
export const usersActions = usersSlice.actions