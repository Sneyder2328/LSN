const {Profile, FriendRequest} = require('../database/database');
const UserNotFoundError = require('../utils/errors/UserNotFoundError');
const {genUUID} = require('../utils/utils');

async function getProfile(username) {
    const user = await Profile.findOne({where: {username}});
    if (!user) throw new UserNotFoundError();
    return user.dataValues;
}

async function sendFriendRequest({senderId, receiverId}) {
    const fRequest = await FriendRequest.create({id: genUUID(), senderId, receiverId, accepted: false});
    console.log("sendFriendRequest", senderId, receiverId, fRequest);
    return fRequest !== null;
}

async function getFriendRequest(userId) {
    const fRequest = await FriendRequest.findAll({where: {receiverId: userId, accepted: false}});
    return fRequest.map(it => it.dataValues);
}

async function acceptFriendRequest(receiverId, senderId) {
    console.log("acceptFriendRequest", receiverId, senderId);
    return await FriendRequest.update({accepted: true}, {where: {receiverId, senderId}});
}

module.exports = {getProfile, sendFriendRequest, getFriendRequest, acceptFriendRequest};