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
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const notificationService_1 = require("./notificationService");
const router = express_1.Router();
exports.notificationsRouter = router;
/**
 * Get incoming notifications by current user
 */
router.get('/notifications/', authenticate_1.default, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notificationService_1.getNotifications(req.userId);
    const unseenCount = yield notificationService_1.getUnseenNotfsCount(req.userId);
    res.status(httpResponseCodes_1.default.OK).send({ notifications, unseenCount });
})));
/**
 * Update status for incoming notification to current user by its id
 * status: 'ack'|'read'|'sent'
 */
router.put(`/notifications/:notificationId`, authenticate_1.default, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield notificationService_1.updateNotfStatus(req.userId, req.params.notificationId, req.body.status);
    res.status(httpResponseCodes_1.default.OK).send(updated);
})));
/**
 * Mark incoming notifications to current user as either acknowledged or read
 * status: 'ack'|'read'
 */
router.put(`/notifications/`, authenticate_1.default, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.body.status;
    const updated = status === 'ack' ? yield notificationService_1.ackIncomingNotifications(req.userId) : yield notificationService_1.markAllNotfsAsRead(req.userId);
    res.status(httpResponseCodes_1.default.OK).send(updated);
})));
