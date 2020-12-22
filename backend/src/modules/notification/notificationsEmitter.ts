import EventEmitter from "events";
import {generateTitleForNotif, saveNotification} from "./notificationService";
import {io} from "../../index";
import {getProfileByUserId} from "../user/userService";

class NotificationsEmitter extends EventEmitter {
}

export const CREATE_NOTIFICATION = 'createNotification'
export const NEW_NOTIFICATION = 'newNotification'

export const notificationsEmitter = new NotificationsEmitter();

export type NotificationObject = {
    id: string;
    recipientId: string;
    senderId: string;
    activityType: 'post_commented' | 'comment_liked' | 'post_liked' | 'post_shared' | 'friendrequest_incoming' | 'friendrequest_accepted';
    activityId: string;
    objectId: string;
    createdAt?: any
}

notificationsEmitter.on(CREATE_NOTIFICATION,
    ({activityType, activityId, objectId, recipientId, senderId, id, createdAt}: NotificationObject) => {
        setImmediate(async () => {
            console.log('CREATE_NOTIFICATION', senderId, recipientId, objectId, activityType);
            await saveNotification({objectId, activityType, activityId, senderId, recipientId, id})
            const senderProfile = await getProfileByUserId(senderId, recipientId, false)
            const avatarUrl = senderProfile.profilePhotoUrl
            const title = await generateTitleForNotif(activityType, senderProfile.fullname, objectId)
            io.to(recipientId).emit(NEW_NOTIFICATION, {
                id, senderId, objectId, activityType, activityId, createdAt,
                title, avatarUrl, status: 'sent'
            })
        });
    });