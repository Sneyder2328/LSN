import userRelationship from "../../utils/constants/userRelationship";

import {AppError} from "../../utils/errors/AppError";
import responseCodes from "../../utils/constants/httpResponseCodes";
import {models, sequelize} from "../../database/database";
import Sequelize from "sequelize";

const {UserRelationShip} = models;
type RelationShipType =
    'friend'
    | 'pendingIncoming'
    | 'pendingOutgoing'
    | 'blockedIncoming'
    | 'blockedOutgoing'
    | undefined;


/**
 * Returns the type of relationship(if any) between two users by their id's
 * @param currentUserId currently logged in user id
 * @param otherUserId other user id
 */
export async function getRelationshipType(currentUserId: string, otherUserId: string): Promise<RelationShipType> {
    let relationship = await UserRelationShip.findOne({
        where: {
            senderId: currentUserId,
            receiverId: otherUserId
        }
    })
    if (relationship) {
        switch (relationship.type) {
            case 'friend':
                return 'friend'
            case 'pending':
                return 'pendingOutgoing'
            case 'block':
                return 'blockedOutgoing'
            default:
                throw new Error("Invalid relationship")
        }
    }
    relationship = await UserRelationShip.findOne({where: {senderId: otherUserId, receiverId: currentUserId}})
    if (relationship) {
        switch (relationship.type) {
            case 'friend':
                return 'friend'
            case 'pending':
                return 'pendingIncoming'
            case 'block':
                return 'blockedIncoming'
            default:
                throw new Error("Invalid relationship")
        }
    }
}

/**
 * Sends a friend request from one user to another
 * @param senderId
 * @param receiverId
 * @return a boolean indicating whether the Friend Request was successfully created
 */
export async function sendFriendRequest(senderId: string, receiverId: string): Promise<boolean> {
    const fRequest = await UserRelationShip.create({senderId, receiverId, type: userRelationship.PENDING});
    return fRequest !== null;
}

const Op = Sequelize.Op;

export async function deleteFriendship(currentUserId: string, otherUserId: string): Promise<boolean> {
    return (await UserRelationShip.destroy({
        where: {
            [Op.or]: [
                {receiverId: currentUserId, senderId: otherUserId}, {receiverId: otherUserId, senderId: currentUserId}
            ]
        }
    })) !== 0;
}

/**
 * Get incoming friend requests in pending status by userId
 * @param userId
 */
export async function getFriendRequests(userId: string) {
    return UserRelationShip.findAll({where: {receiverId: userId, type: userRelationship.PENDING}});
}

/**
 * Get current friends by userId
 * @param userId
 */
export async function getCurrentFriends(userId: string) {
    const friendsUserSent = await sequelize.query(`SELECT userId, username, profilePhotoUrl, fullname, coverPhotoUrl, description FROM Profile
JOIN User_Relationship UR ON userId = UR.receiverId
WHERE UR.senderId = '${userId}' AND UR.type = 'friend'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    const friendsUserReceived = await sequelize.query(`SELECT userId, username, profilePhotoUrl, fullname, coverPhotoUrl, description FROM Profile
JOIN User_Relationship UR ON userId = UR.senderId
WHERE UR.receiverId = '${userId}' AND UR.type = 'friend'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
    return [...friendsUserSent, ...friendsUserReceived]
    // return UserRelationShip.findAll({
    //     where: {
    //         // [Op.or]: [{receiverId: userId}, {senderId: userId}],
    //         senderId: userId,
    //         type: userRelationship.FRIEND
    //     },
    // });
}

/**
 * Get users suggestions for a given userId
 * @param userId
 */
export async function getUserSuggestions(userId: string) {
    return sequelize.query(`SELECT userSuggestedId as userId, relatedness, 
description, fullname, username, profilePhotoUrl, coverPhotoUrl
FROM User_Suggestion US JOIN Profile P ON P.userId=US.userSuggestedId
WHERE status='active' AND US.userId='${userId}'`, {
        // @ts-ignore
        type: sequelize.QueryTypes.SELECT
    })
}

export async function removeUserSuggestion(userId: string, suggestedUserId: string): Promise<boolean> {
    const updated = await sequelize.query(`UPDATE User_Suggestion SET status='removed' 
WHERE userId='${userId}' AND userSuggestedId='${suggestedUserId}'`)
    console.log('removeUserSuggestion', userId, suggestedUserId, updated);
    // @ts-ignore
    return updated[0]?.affectedRows === 1
}

export async function handleFriendRequest(receiverId, senderId, action: 'confirm' | 'deny') {
    if (action === 'confirm')
        return UserRelationShip.update({type: userRelationship.FRIEND}, {where: {receiverId, senderId}});
    if (action === 'deny')
        return UserRelationShip.destroy({where: {receiverId, senderId}});
    throw new AppError(responseCodes.BAD_REQUEST, 'Invalid Action', `${action} is not a valid action for handling friend requests`)
}
