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
function getMessagesByConversation(conversationId, userId, otherUserId, offset, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield database_1.sequelize.query(`
    SELECT id, userId as senderId, replyTo, content, typeContent, status, createdAt FROM Message 
    WHERE conversationId = '${conversationId}'` + (offset ? ` AND createdAt < '${offset}'` : ``) + `
    ORDER BY createdAt DESC 
    LIMIT ${limit}
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
}
// TODO (find a way to check for deletedFor attr, actually like it is above it is not working as it's returning empty([]))
exports.getMessages = (userId, otherUserId, offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, created } = yield exports.getConversationId(userId, otherUserId);
    console.log('getConversationId', conversationId, created);
    if (created)
        return [];
    return yield getMessagesByConversation(conversationId, userId, otherUserId, offset, limit);
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
    const outgoingConversations = yield database_1.sequelize.query(`
SELECT C.userTwoId as interlocutorId, 
C.id as conversationId, 
P.username as username, 
P.fullname as fullname, 
P.description as description,
P.coverPhotoUrl as coverPhotoUrl, 
P.profilePhotoUrl as profilePhotoUrl, 
P.userId as userId
FROM Conversation C 
JOIN Profile P ON P.userId=C.userTwoId 
WHERE userOneId='${userId}'
`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    const incomingConversations = yield database_1.sequelize.query(`
SELECT C.userOneId as interlocutorId, 
C.id as conversationId, 
P.username as username, 
P.fullname as fullname, 
P.description as description,
P.coverPhotoUrl as coverPhotoUrl, 
P.profilePhotoUrl as profilePhotoUrl, 
P.userId as userId
FROM Conversation C 
JOIN Profile P ON P.userId=C.userOneId 
WHERE userTwoId='${userId}'
`, {
        // @ts-ignore
        type: database_1.sequelize.QueryTypes.SELECT
    });
    return (yield Promise.all([...outgoingConversations, ...incomingConversations].map(({ interlocutorId, conversationId, username, fullname, description, coverPhotoUrl, profilePhotoUrl, userId, }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const messages = yield getMessagesByConversation(conversationId, userId, interlocutorId, undefined, 1);
        return {
            conversationId,
            interlocutorId,
            authorProfile: {
                userId, username, fullname, description, coverPhotoUrl, profilePhotoUrl
            },
            message: (_b = messages) === null || _b === void 0 ? void 0 : _b[0]
        };
    })))).filter(({ message }) => message).sort((conv1, conv2) => conv2.message.createdAt - conv1.message.createdAt) || [];
});
