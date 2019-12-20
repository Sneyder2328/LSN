const {Profile, UserRelationShip} = require('../database/database');
const UserNotFoundError = require('../utils/errors/UserNotFoundError');
const userRelationship = require('../utils/constants/userRelationship');

async function getProfile(username) {
    const user = await Profile.findOne({where: {username}});
    if (!user) throw new UserNotFoundError();
    return user;
}

async function sendFriendRequest(senderId, receiverId) {
    const fRequest = await UserRelationShip.create({senderId, receiverId, type: userRelationship.PENDING});
    return fRequest !== null;
}

async function getFriendRequests(userId) {
    return UserRelationShip.findAll({where: {receiverId: userId, type: userRelationship.PENDING}});
}

async function handleFriendRequest(receiverId, senderId, action) {
    if (action === 'confirm') {
        return await UserRelationShip.update({type: userRelationship.FRIEND}, {where: {receiverId, senderId}});
    }
    return await UserRelationShip.destroy({where: {receiverId, senderId}})
}

module.exports = {getProfile, sendFriendRequest, getFriendRequests, handleFriendRequest};