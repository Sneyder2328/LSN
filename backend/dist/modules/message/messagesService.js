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
const database_1 = require("../../database/database");
const utils_1 = require("../../utils/utils");
exports.getConversationId = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let conversationId = yield database_1.sequelize.query(`SELECT id FROM Conversation 
WHERE (userOneId='${userId}' AND userTwoId='${otherUserId}') 
OR (userOneId='${otherUserId}' AND userTwoId='${userId}') 
LIMIT 1`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    conversationId = (_a = conversationId[0]) === null || _a === void 0 ? void 0 : _a.id;
    if (!conversationId) {
        conversationId = utils_1.genUUID();
        const resultInsert = yield database_1.sequelize.query(`INSERT INTO Conversation(id, userOneId, userTwoId) VALUES('${conversationId}', '${userId}', '${otherUserId}')`);
        console.log('resultInsert=', resultInsert);
        return { conversationId, created: true };
    }
    return { conversationId, created: false };
});
exports.getMessagesPaged = (userId, otherUserId, offsetCreatedAt, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, created } = yield exports.getConversationId(userId, otherUserId);
    console.log('getConversationId', conversationId, created);
    if (created)
        return [];
    const sql = offsetCreatedAt ? `SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
WHERE createdAt < ${offsetCreatedAt} AND conversationId = '${conversationId}' ORDER BY createdAt DESC LIMIT ${limit}`
        : `SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
WHERE conversationId = '${conversationId}' ORDER BY createdAt DESC LIMIT ${limit}`;
    const messages = yield database_1.sequelize.query(sql, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    return messages.map(({ id, senderId, replyTo, content, typeContent, status, createdAt }) => {
        return {
            id, senderId, replyTo, content, typeContent, status, createdAt,
            recipientId: senderId === userId ? otherUserId : userId
        };
    });
});
//AND deletedFor != '${userId}'
// TODO (find a way to check for deletedFor attr, actually like it is above it is not working as it's returning empty([]))
exports.getMessages = (userId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, created } = yield exports.getConversationId(userId, otherUserId);
    console.log('getConversationId', conversationId, created);
    if (created)
        return [];
    const messages = yield database_1.sequelize.query(`
SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
WHERE conversationId = '${conversationId}' ORDER BY createdAt DESC
`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    return messages.map(({ id, senderId, replyTo, content, typeContent, status, createdAt }) => {
        return {
            id, senderId, replyTo, content, typeContent, status, createdAt,
            recipientId: senderId === userId ? otherUserId : userId
        };
    });
});
exports.sendMessage = ({ id, conversationId, userId, content }) => __awaiter(void 0, void 0, void 0, function* () {
    const resultInsert = yield database_1.sequelize.query(`INSERT INTO Message(id, conversationId, userId, content) 
VALUES('${id}', '${conversationId}', '${userId}', '${content}')`);
    console.log('resultInsert message=', resultInsert);
});
exports.deleteMessage = (userId, messageId, deleteFor) => __awaiter(void 0, void 0, void 0, function* () {
    if (deleteFor === 'both') {
        // TODO verify msg was sent by me, if not throw error
        return database_1.sequelize.query(`DELETE FROM message WHERE id='${messageId}'`);
    }
    if (deleteFor !== userId) {
        throw new Error('You cannot delete a message from someone else\'s record');
    }
    return database_1.sequelize.query(`
UPDATE message SET deletedFor='${userId}}' 
WHERE id='${messageId}'`);
});
/**
 * Get conversations by a given user
 * @param userId
 */
exports.getConversations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const outgoingConversations = yield database_1.sequelize.query(`SELECT M.id as messageId, M.userId as senderId, M.replyTo as replyTo, M.content as content, 
M.typeContent as typeContent, M.createdAt as createdAt, M.status as 'status',
C.userTwoId as interlocutorId, C.id as conversationId, 
P.username as username, P.fullname as fullname, P.description as description,
P.coverPhotoUrl as coverPhotoUrl, P.profilePhotoUrl as profilePhotoUrl, P.userId as userId
FROM Conversation C JOIN Profile P ON P.userId=C.userTwoId JOIN Message M ON M.conversationId=C.id
WHERE userOneId='${userId}'
ORDER BY createdAt DESC LIMIT 1`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    const incomingConversations = yield database_1.sequelize.query(`SELECT M.id as messageId, M.userId as senderId, M.replyTo as replyTo, M.content as content, 
M.typeContent as typeContent, M.createdAt as createdAt, M.status as 'status',
C.userOneId as interlocutorId, C.id as conversationId, 
P.username as username, P.fullname as fullname, P.description as description,
P.coverPhotoUrl as coverPhotoUrl, P.profilePhotoUrl as profilePhotoUrl, P.userId as userId
FROM Conversation C JOIN Profile P ON P.userId=C.userOneId JOIN Message M ON M.conversationId=C.id
WHERE userTwoId='${userId}'
ORDER BY createdAt DESC LIMIT 1`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    //     const conversations: any = await sequelize.query(`
    // SELECT M.id as messageId, M.userId as senderId, M.replyTo as replyTo, M.content as content,
    // M.typeContent as typeContent, M.createdAt as createdAt, M.status as 'status',
    // C.userTwoId as interlocutorId, C.id as conversationId,
    // P.username as username, P.fullname as fullname, P.description as description,
    // P.coverPhotoUrl as coverPhotoUrl, P.profilePhotoUrl as profilePhotoUrl, P.userId as userId
    // FROM Conversation C JOIN Profile P ON P.userId=C.userTwoId JOIN Message M ON M.conversationId=C.id
    // WHERE userOneId='${userId}' ORDER BY M.createdAt DESC LIMIT 1
    // UNION
    // SELECT M.id as messageId, M.userId as senderId, M.replyTo as replyTo, M.content as content,
    // M.typeContent as typeContent, M.createdAt as createdAt, M.status as 'status',
    // C.userOneId as interlocutorId, C.id as conversationId,
    // P.username as username, P.fullname as fullname, P.description as description,
    // P.coverPhotoUrl as coverPhotoUrl, P.profilePhotoUrl as profilePhotoUrl, P.userId as userId
    // FROM Conversation C JOIN Profile P ON P.userId=C.userOneId JOIN Message M ON M.conversationId=C.id
    // WHERE userTwoId='${userId}' ORDER BY M.createdAt DESC LIMIT 1
    // `, {
    //         // @ts-ignore
    //         type: sequelize.QueryTypes.SELECT
    //     })
    return [...outgoingConversations, ...incomingConversations].map(({ interlocutorId, conversationId, username, fullname, description, coverPhotoUrl, profilePhotoUrl, userId, messageId, senderId, content, typeContent, status, createdAt, replyTo }) => {
        return {
            conversationId,
            interlocutorId,
            authorProfile: {
                userId, username, fullname, description, coverPhotoUrl, profilePhotoUrl
            },
            message: {
                id: messageId,
                senderId,
                content, typeContent, status, createdAt, replyTo,
                recipientId: userId === senderId ? interlocutorId : senderId
            }
        };
    }) || [];
});
