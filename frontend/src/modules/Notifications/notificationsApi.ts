import {transport} from "../../api";
import {AxiosResponse} from "axios";
import {NotificationObject} from "./notificationsReducer";

export const NotificationsApi = {
    async getNotifications(): Promise<AxiosResponse<Array<NotificationObject>>> {
        return await transport.get('/notifications/');
    }
};

export const ActivityType = {
    POST_COMMENTED: 'post_commented',
    COMMENT_LIKED: 'comment_liked',
    POST_LIKED: 'post_liked',
    POST_SHARED: 'post_shared',
    FR_INCOMING: 'friendrequest_incoming',
    FR_ACCEPTED: 'friendrequest_accepted'
}