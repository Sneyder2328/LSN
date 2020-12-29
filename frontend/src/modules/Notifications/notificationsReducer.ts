import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertToHashTable, HashTable } from "../../utils/utils";

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
    unseenCount?: number;
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
            state.unseenCount = (state.unseenCount ?? 0) + 1
        },
        hideNotification: (state, action: PayloadAction<string>) => {
            state.inDisplay = state.inDisplay.filter((notfId) => notfId !== action.payload)
        },
        loadNotificationsSuccess: (state, action: PayloadAction<{ notifications: Array<NotificationObject>; unseenCount: number }>) => {
            const { notifications, unseenCount } = action.payload
            state.entities = convertToHashTable(notifications)
            state.allIds = notifications.map((notf) => notf.id)
            state.unseenCount = unseenCount
        },
        updateNotificationStatusSuccess: (state, action: PayloadAction<{ notificationId: string; status: string }>) => {
            const { notificationId, status } = action.payload
            state.entities[notificationId].status = status
        },
        ackNotificationsSuccess: (state) => {
            state.unseenCount = 0
        }
    }
})

export const notificationsReducer = notificationsSlice.reducer
export const notificationsActions = notificationsSlice.actions