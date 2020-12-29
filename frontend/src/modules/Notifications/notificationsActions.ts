import { AppThunk } from "../../store";
import { notificationsActions } from "./notificationsReducer";
import { NotificationsApi } from "./notificationsApi";

export const loadNotifications = (): AppThunk => async (dispatch) => {
    try {
        const response = await NotificationsApi.getNotifications()
        if (response.data) {
            dispatch(notificationsActions.loadNotificationsSuccess(response.data))
        }
    } catch (err) {
        console.log('error fetching notifications', err)
    }
}

export const markNotfAsRead = (notificationId: string): AppThunk => async (dispatch) => {
    try {
        const response = await NotificationsApi.updateNotificationStatus(notificationId, 'read')
        if (response.data) {
            dispatch(notificationsActions.updateNotificationStatusSuccess({ notificationId, status: 'read' }))
        }
    } catch (err) {

    }
}

export const ackNotifications = (): AppThunk => async (dispatch) => {
    try {
        const response = await NotificationsApi.ackNotifications()
        if (response.data) {
            dispatch(notificationsActions.ackNotificationsSuccess())
        }
    } catch (err) {
        console.log('ackNotifications err', err);
    }
}