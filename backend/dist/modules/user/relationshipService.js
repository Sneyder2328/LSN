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
const userRelationship_1 = __importDefault(require("../../utils/constants/userRelationship"));
const AppError_1 = require("../../utils/errors/AppError");
const httpResponseCodes_1 = __importDefault(require("../../utils/constants/httpResponseCodes"));
const database_1 = require("../../database/database");
const sequelize_1 = __importDefault(require("sequelize"));
const userSuggestionsEmitter_1 = require("./userSuggestionsEmitter");
const notificationService_1 = require("../notification/notificationService");
const { UserRelationShip } = database_1.models;
/**
 * Returns the type of relationship(if any) between two users by their id's
 * @param currentUserId currently logged in user id
 * @param otherUserId other user id
 */
function getRelationshipType(currentUserId, otherUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let relationship = yield UserRelationShip.findOne({
            where: {
                senderId: currentUserId,
                receiverId: otherUserId
            }
        });
        if (relationship) {
            switch (relationship.type) {
                case 'friend':
                    return 'friend';
                case 'pending':
                    return 'pendingOutgoing';
                case 'block':
                    return 'blockedOutgoing';
                default:
                    throw new Error("Invalid relationship");
            }
        }
        relationship = yield UserRelationShip.findOne({ where: { senderId: otherUserId, receiverId: currentUserId } });
        if (relationship) {
            switch (relationship.type) {
                case 'friend':
                    return 'friend';
                case 'pending':
                    return 'pendingIncoming';
                case 'block':
                    return 'blockedIncoming';
                default:
                    throw new Error("Invalid relationship");
            }
        }
    });
}
exports.getRelationshipType = getRelationshipType;
/**
 * Sends a friend request from one user to another
 * @param senderId
 * @param receiverId
 * @return a boolean indicating whether the Friend Request was successfully created
 */
function sendFriendRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fRequest = yield UserRelationShip.create({ senderId, receiverId, type: userRelationship_1.default.PENDING });
        const sent = fRequest !== null;
        if (sent) {
            userSuggestionsEmitter_1.userSuggestionsEmitter.emit(userSuggestionsEmitter_1.DELETE_USER_SUGGESTION, senderId, receiverId);
            userSuggestionsEmitter_1.userSuggestionsEmitter.emit(userSuggestionsEmitter_1.DELETE_USER_SUGGESTION, receiverId, senderId);
            notificationService_1.generateNotification(senderId, receiverId, senderId, notificationService_1.ActivityType.FR_INCOMING, senderId);
        }
        return sent;
    });
}
exports.sendFriendRequest = sendFriendRequest;
const Op = sequelize_1.default.Op;
function deleteFriendship(currentUserId, otherUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield UserRelationShip.destroy({
            where: {
                [Op.or]: [
                    { receiverId: currentUserId, senderId: otherUserId }, { receiverId: otherUserId, senderId: currentUserId }
                ]
            }
        })) !== 0;
    });
}
exports.deleteFriendship = deleteFriendship;
/**
 * Get incoming friend requests in pending status by userId
 * @param userId
 */
function getFriendRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return UserRelationShip.findAll({ where: { receiverId: userId, type: userRelationship_1.default.PENDING } });
    });
}
exports.getFriendRequests = getFriendRequests;
/**
 * Get current friends by userId
 * @param userId
 */
function getCurrentFriends(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendsUserSent = yield database_1.sequelize.query(`SELECT userId, username, profilePhotoUrl, fullname, coverPhotoUrl, description FROM Profile
JOIN User_Relationship UR ON userId = UR.receiverId
WHERE UR.senderId = '${userId}' AND UR.type = 'friend'`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        const friendsUserReceived = yield database_1.sequelize.query(`SELECT userId, username, profilePhotoUrl, fullname, coverPhotoUrl, description FROM Profile
JOIN User_Relationship UR ON userId = UR.senderId
WHERE UR.receiverId = '${userId}' AND UR.type = 'friend'`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
        return [...friendsUserSent, ...friendsUserReceived];
    });
}
exports.getCurrentFriends = getCurrentFriends;
/**
 * Get users suggestions[already computed] for a given userId
 * @param userId
 */
function getUserSuggestions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.sequelize.query(`SELECT userSuggestedId as userId, relatedness, 
description, fullname, username, profilePhotoUrl, coverPhotoUrl
FROM User_Suggestion US JOIN Profile P ON P.userId=US.userSuggestedId
WHERE status='active' AND US.userId='${userId}'`, {
            // @ts-ignore
            type: database_1.sequelize.QueryTypes.SELECT
        });
    });
}
exports.getUserSuggestions = getUserSuggestions;
/**
 * Generate users suggestions for a given user
 */
function generateUserSuggestions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.sequelize.query(`
REPLACE INTO user_suggestion(userId, userSuggestedId, relatedness)
SELECT '${userId}',
       userId,
       1
FROM Profile
WHERE userId != '${userId}'
  AND userId NOT IN (SELECT senderId
                     FROM user_relationship
                     WHERE receiverId = '${userId}'
                       AND (type = 'friend' OR type = 'pending' OR type = 'block'))
  AND userId NOT IN (SELECT receiverId
                     FROM user_relationship
                     WHERE senderId = '${userId}'
                       AND (type = 'friend' OR type = 'pending' OR type = 'block'))
  AND userId NOT IN (SELECT userSuggestedId
                     FROM user_suggestion
                     WHERE userId = '${userId}'
                       AND status = 'removed')`);
    });
}
exports.generateUserSuggestions = generateUserSuggestions;
function removeUserSuggestion(userId, suggestedUserId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const updated = yield database_1.sequelize.query(`UPDATE User_Suggestion SET status='removed' 
WHERE userId='${userId}' AND userSuggestedId='${suggestedUserId}'`);
        console.log('removeUserSuggestion', userId, suggestedUserId, updated);
        //removeUserSuggestion 04b770f0-0ff0-4510-876b-89c42039af7b 2a4f667c-901d-47fb-ae47-1fdce4700211 [ { affectedRows: 0, insertId: 0, warningStatus: 0 }, undefined ]
        // @ts-ignore
        return ((_a = updated[0]) === null || _a === void 0 ? void 0 : _a.affectedRows) === 1;
    });
}
exports.removeUserSuggestion = removeUserSuggestion;
function handleFriendRequest(receiverId, senderId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action === 'confirm') {
            notificationService_1.generateNotification(receiverId, senderId, receiverId, notificationService_1.ActivityType.FR_ACCEPTED, receiverId);
            return UserRelationShip.update({ type: userRelationship_1.default.FRIEND }, { where: { receiverId, senderId } });
        }
        if (action === 'deny')
            return UserRelationShip.destroy({ where: { receiverId, senderId } });
        throw new AppError_1.AppError(httpResponseCodes_1.default.BAD_REQUEST, 'Invalid Action', `${action} is not a valid action for handling friend requests`);
    });
}
exports.handleFriendRequest = handleFriendRequest;
