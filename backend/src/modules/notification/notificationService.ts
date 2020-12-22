import {CREATE_NOTIFICATION, NotificationObject, notificationsEmitter} from "./notificationsEmitter";
import {sequelize} from "../../database/database";
import {genUUID} from "../../utils/utils";
import {getPostPreview} from "../post/postService";
import {getCommentPreview} from "../comment/commentService";
import {getProfileByUserId} from "../user/userService";

export async function saveNotification({activityType, activityId, objectId, recipientId, senderId, id}: NotificationObject) {
    return sequelize.query(`
INSERT INTO Notification(id, recipientId, senderId, activityType, activityId, objectId, status)
VALUES ('${id}', '${recipientId}', '${senderId}', '${activityType}', '${activityId}','${objectId}', 'sent')`)
}

export const generateNotification = (objectId, recipientId, senderId, activityType, activityId) => {
    console.log('generateNotification', recipientId, senderId, activityType)
    if (recipientId === senderId) return
    const notification: NotificationObject = {
        objectId,
        recipientId,
        senderId,
        activityType,
        activityId,
        id: genUUID(),
        createdAt: new Date()
    }
    console.log('generateNotification', notification)
    notificationsEmitter.emit(CREATE_NOTIFICATION, notification)
};

export const getNotifications = async (userId: string) => {
    const notifications: any = await sequelize.query(`
SELECT id, senderId, activityType, activityId, objectId, status, createdAt
FROM Notification
WHERE recipientId = '${userId}'
ORDER BY createdAt DESC
`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return Promise.all(notifications.map(async ({id, senderId, activityType, activityId, objectId, status, createdAt}) => {
        const senderProfile = await getProfileByUserId(senderId, userId, false)
        const avatarUrl = senderProfile.profilePhotoUrl
        const title = await generateTitleForNotif(activityType, senderProfile.fullname, objectId)
        return {
            id, senderId, activityType, activityId, objectId, status, createdAt, title, avatarUrl
        }
    }))
}

export const generateTitleForNotif = async (activityType: string, senderName: string, objectId: string): Promise<string> => {
    const name = `<strong>${senderName}</strong>`
    switch (activityType) {
        case ActivityType.POST_LIKED:
            const postContent = (await getPostPreview(objectId)).text
            return `${name} likes your post: '${postContent}'`
        case ActivityType.COMMENT_LIKED:
            const commentContent = (await getCommentPreview(objectId)).text
            return `${name} likes your comment: '${commentContent}'`
        case ActivityType.POST_COMMENTED:
            return `${name} commented on your post`
        case ActivityType.POST_SHARED:
            return `${name} shared your post`
        case ActivityType.FR_INCOMING:
            return `${name} sent you a friend request`
        case ActivityType.FR_ACCEPTED:
            return `${name} accepted your friend request`
    }
    throw new Error(`Invalid activity type: ${activityType}`)
}

export const ActivityType = {
    POST_COMMENTED: 'post_commented',
    COMMENT_LIKED: 'comment_liked',
    POST_LIKED: 'post_liked',
    POST_SHARED: 'post_shared',
    FR_INCOMING: 'friendrequest_incoming',
    FR_ACCEPTED: 'friendrequest_accepted'
}