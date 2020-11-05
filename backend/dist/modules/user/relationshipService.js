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
        return fRequest !== null;
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
        // return UserRelationShip.findAll({
        //     where: {
        //         // [Op.or]: [{receiverId: userId}, {senderId: userId}],
        //         senderId: userId,
        //         type: userRelationship.FRIEND
        //     },
        // });
    });
}
exports.getCurrentFriends = getCurrentFriends;
function handleFriendRequest(receiverId, senderId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action === 'confirm')
            return UserRelationShip.update({ type: userRelationship_1.default.FRIEND }, { where: { receiverId, senderId } });
        if (action === 'deny')
            return UserRelationShip.destroy({ where: { receiverId, senderId } });
        throw new AppError_1.AppError(httpResponseCodes_1.default.BAD_REQUEST, 'Invalid Action', `${action} is not a valid action for handling friend requests`);
    });
}
exports.handleFriendRequest = handleFriendRequest;
