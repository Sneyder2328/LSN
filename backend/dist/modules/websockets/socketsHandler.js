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
const utils_1 = require("../../utils/utils");
const database_1 = require("../../database/database");
const messagesService_1 = require("../message/messagesService");
const { Token } = database_1.models;
const CREATE_MESSAGE_EVENT = 'createMessage';
const NEW_MESSAGE_EVENT = 'newMessage';
exports.handleSocket = (io) => {
    io.on('connection', socket => {
        console.log('new user connected');
        socket.on('join', (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
            if (!utils_1.isRealString(params.refreshToken))
                return callback("Invalid token"); // TODO use a better validation
            const token = yield Token.findByPk(params.refreshToken);
            if (!token)
                return callback("Token passed is not existent");
            socket.join(token.userId); // join a room using its id
            callback();
        }));
        socket.on(CREATE_MESSAGE_EVENT, (message, callback) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(CREATE_MESSAGE_EVENT, message);
            const token = yield Token.findByPk(message.senderToken);
            if (!token)
                return callback("Token passed is not existent");
            const { conversationId } = yield messagesService_1.getConversationId(token.userId, message.recipientId);
            yield messagesService_1.sendMessage({ id: message.id, conversationId, userId: token.userId, content: message.content });
            // send new message event to the rooms of the recipient and the sender
            io.to(message.recipientId).to(token.userId).emit(NEW_MESSAGE_EVENT, {
                id: message.id,
                senderId: token.userId,
                recipientId: message.recipientId,
                content: message.content,
                typeContent: message.typeContent,
                status: 'sent',
                createdAt: new Date()
            });
            callback();
        }));
        socket.on('disconnect', () => {
            console.log('disconnected from user');
        });
    });
};
