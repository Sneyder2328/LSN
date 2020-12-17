import {AppThunk} from "../../store";
import {notificationsActions} from "./notificationsReducer";
import {NotificationsApi} from "./notificationsApi";

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