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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const notificationService_1 = require("./notificationService");
const index_1 = require("../../index");
const userService_1 = require("../user/userService");
class NotificationsEmitter extends events_1.default {
}
exports.CREATE_NOTIFICATION = 'createNotification';
exports.NEW_NOTIFICATION = 'newNotification';
exports.notificationsEmitter = new NotificationsEmitter();
exports.notificationsEmitter.on(exports.CREATE_NOTIFICATION, ({ activityType, activityId, objectId, recipientId, senderId, id, createdAt }) => {
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('CREATE_NOTIFICATION', senderId, recipientId, objectId, activityType);
        yield notificationService_1.saveNotification({ objectId, activityType, activityId, senderId, recipientId, id });
        const senderProfile = yield userService_1.getProfileByUserId(senderId, false, recipientId, false);
        const avatarUrl = senderProfile.profilePhotoUrl;
        const title = yield notificationService_1.generateTitleForNotif(activityType, senderProfile.fullname, objectId);
        index_1.io.to(recipientId).emit(exports.NEW_NOTIFICATION, {
            id, senderId, objectId, activityType, activityId, createdAt,
            title, avatarUrl, status: 'sent'
        });
    }));
});
