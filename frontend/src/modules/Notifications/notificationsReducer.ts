import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {convertToHashTable, HashTable} from "../../utils/utils";

export type NotificationObject = {
    id: string;
    senderId: string;
    activityType: 'post_commented' | 'comment_liked' | 'post_liked' | 'post_shared' | 'friendrequest_incoming' | 'friendrequest_accepted';
    activityId: string;
    objectId: string;
    status: string;
    title: string;
    avatarUrl: string;
    createdAt: any;
}

export interface NotificationsState {
    entities: HashTable<NotificationObject>;
    allIds: Array<string>
    inDisplay: Array<string>;
}

const initialState = {
    entities: {},
    inDisplay: [],
    allIds: []
} as NotificationsState

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<NotificationObject>) => {
            state.entities[action.payload.id] = action.payload
            state.inDisplay.push(action.payload.id)
            state.allIds = [action.payload.id, ...state.allIds]
        },
        hideNotification: (state, action: PayloadAction<string>) => {
            state.inDisplay = state.inDisplay.filter((notfId) => notfId !== action.payload)
        },
        loadNotificationsSuccess: (state, action: PayloadAction<Array<NotificationObject>>) => {
            state.entities = convertToHashTable(action.payload)
            state.allIds = action.payload.map((notf) => notf.id)
        }
    }
})

export const notificationsReducer = notificationsSlice.reducer
export const notificationsActions = notificationsSlice.actions