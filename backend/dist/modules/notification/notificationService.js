"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationsEmitter_1 = require("./notificationsEmitter");
const database_1 = require("../../database/database");
const utils_1 = require("../../utils/utils");
const postService_1 = require("../post/postService");
const commentService_1 = require("../comment/commentService");
const userService_1 = require("../user/userService");
function saveNotification({ activityType, activityId, objectId, recipientId, senderId, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.sequelize.query(`
INSERT INTO Notification(id, recipientId, senderId, activityType, activityId, objectId, status)
VALUES ('${id}', '${recipientId}', '${senderId}', '${activityType}', '${activityId}','${objectId}', 'sent')`);
    });
}
exports.saveNotification = saveNotification;
exports.generateNotification = (objectId, recipientId, senderId, activityType, activityId) => {
    console.log('generateNotification', recipientId, senderId, activityType);
    if (recipientId === senderId)
        return;
    const notification = {
        objectId,
        recipientId,
        senderId,
        activityType,
        activityId,
        id: utils_1.genUUID(),
        createdAt: new Date()
    };
    console.log('generateNotification', notification);
    notificationsEmitter_1.notificationsEmitter.emit(notificationsEmitter_1.CREATE_NOTIFICATION, notification);
};
exports.getNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield database_1.sequelize.query(`
SELECT id, senderId, activityType, activityId, objectId, status, createdAt
FROM Notification
WHERE recipientId = '${userId}'
ORDER BY createdAt DESC
`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    return Promise.all(notifications.map(({ id, senderId, activityType, activityId, objectId, status, createdAt }) => __awaiter(void 0, void 0, void 0, function* () {
        const senderProfile = yield userService_1.getProfileByUserId(senderId, false, userId, false);
        const avatarUrl = senderProfile.profilePhotoUrl;
        const title = yield exports.generateTitleForNotif(activityType, senderProfile.fullname, objectId);
        return {
            id, senderId, activityType, activityId, objectId, status, createdAt, title, avatarUrl
        };
    })));
});
exports.generateTitleForNotif = (activityType, senderName, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const name = `<strong>${senderName}</strong>`;
    switch (activityType) {
        case exports.ActivityType.POST_LIKED:
            const postContent = (yield postService_1.getPostPreview(objectId)).text;
            return `${name} likes your post: '${postContent}'`;
        case exports.ActivityType.COMMENT_LIKED:
            const commentContent = (yield commentService_1.getCommentPreview(objectId)).text;
            return `${name} likes your comment: '${commentContent}'`;
        case exports.ActivityType.POST_COMMENTED:
            return `${name} commented on your post`;
        case exports.ActivityType.POST_SHARED:
            return `${name} shared your post`;
        case exports.ActivityType.FR_INCOMING:
            return `${name} sent you a friend request`;
        case exports.ActivityType.FR_ACCEPTED:
            return `${name} accepted your friend request`;
    }
    throw new Error(`Invalid activity type: ${activityType}`);
});
exports.ActivityType = {
    POST_COMMENTED: 'post_commented',
    COMMENT_LIKED: 'comment_liked',
    POST_LIKED: 'post_liked',
    POST_SHARED: 'post_shared',
    FR_INCOMING: 'friendrequest_incoming',
    FR_ACCEPTED: 'friendrequest_accepted'
};
