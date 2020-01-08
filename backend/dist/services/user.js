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
const { Profile, UserRelationShip } = require('../database/database');
const UserNotFoundError = require('../utils/errors/UserNotFoundError');
const userRelationship = require('../utils/constants/userRelationship');
function getProfile(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Profile.findOne({ where: { username } });
        if (!user)
            throw new UserNotFoundError();
        return user;
    });
}
function sendFriendRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fRequest = yield UserRelationShip.create({ senderId, receiverId, type: userRelationship.PENDING });
        return fRequest !== null;
    });
}
function getFriendRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return UserRelationShip.findAll({ where: { receiverId: userId, type: userRelationship.PENDING } });
    });
}
function handleFriendRequest(receiverId, senderId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action === 'confirm') {
            return yield UserRelationShip.update({ type: userRelationship.FRIEND }, { where: { receiverId, senderId } });
        }
        return yield UserRelationShip.destroy({ where: { receiverId, senderId } });
    });
}
module.exports = { getProfile, sendFriendRequest, getFriendRequests, handleFriendRequest };
