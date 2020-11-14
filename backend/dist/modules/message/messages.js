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
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const validate_1 = require("../../middlewares/validate");
const handleErrorAsync_1 = require("../../middlewares/handleErrorAsync");
const messagesService_1 = require("./messagesService");
const router = express_1.Router();
exports.messagesRouter = router;
/** ?offsetCreatedAt='date'&limit='number'
 * Get messages in conversation with other user
 */
router.get('/conversations/:otherUserId/messages', authenticate_1.default, validate_1.getMessagesValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messagesService_1.getMessages(req.userId, req.params.otherUserId);
    res.status(httpResponseCodes_1.default.OK).send(messages);
})));
/**
 * Get conversations of the current user
 */
router.get('/conversations/', authenticate_1.default, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversations = yield messagesService_1.getConversations(req.userId);
    res.status(httpResponseCodes_1.default.OK).send(conversations);
})));
/**
 * Delete a message given its id
 * Use soft-delete in case of deleting it for a single user
 * Otherwise, use hard delete
 */
router.delete('/messages/:messageId', authenticate_1.default, validate_1.deleteMessageValidationRules, validate_1.validate, handleErrorAsync_1.handleErrorAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield messagesService_1.deleteMessage(req.userId, req.params.messageId, req.query.deleteFor);
    res.status(httpResponseCodes_1.default.OK).send(deleted != undefined);
})));
