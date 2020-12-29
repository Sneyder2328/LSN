import { transport } from "../../api";
import { AxiosResponse } from "axios";
import { NotificationObject } from "./notificationsReducer";

export const NotificationsApi = {
    async getNotifications(): Promise<AxiosResponse<{notifications: Array<NotificationObject>; unseenCount: number}>> {
        return await transport.get('/notifications/');
    },
    async updateNotificationStatus(notificationId: string, status: string): Promise<AxiosResponse<Boolean>> {
        return await transport.put(`/notifications/${notificationId}`, { status });
    },
    async ackNotifications(): Promise<AxiosResponse<Boolean>> {
        return await transport.put(`/notifications/`, { status: 'ack' });
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