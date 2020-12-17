import userRelationship from "../../utils/constants/userRelationship";

import {AppError} from "../../utils/errors/AppError";
import responseCodes from "../../utils/constants/httpResponseCodes";
import {models, sequelize} from "../../database/database";
import Sequelize from "sequelize";
import {DELETE_USER_SUGGESTION, userSuggestionsEmitter} from "./userSuggestionsEmitter";
import {ActivityType, generateNotification} from "../notification/notificationService";

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
    const sent = fRequest !== null;
    if (sent) {
        userSuggestionsEmitter.emit(DELETE_USER_SUGGESTION, senderId, receiverId)
        userSuggestionsEmitter.emit(DELETE_USER_SUGGESTION, receiverId, senderId)
        generateNotification(senderId, receiverId, senderId, ActivityType.FR_INCOMING, senderId);
    }
    return sent;
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
}

/**
 * Get users suggestions[already computed] for a given userId
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

/**
 * Generate users suggestions for a given user
 */
export async function generateUserSuggestions(userId: string) {
    return sequelize.query(`
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
                       AND status = 'removed')`)
}

export async function removeUserSuggestion(userId: string, suggestedUserId: string): Promise<boolean> {
    const updated = await sequelize.query(`UPDATE User_Suggestion SET status='removed' 
WHERE userId='${userId}' AND userSuggestedId='${suggestedUserId}'`)
    console.log('removeUserSuggestion', userId, suggestedUserId, updated);
    //removeUserSuggestion 04b770f0-0ff0-4510-876b-89c42039af7b 2a4f667c-901d-47fb-ae47-1fdce4700211 [ { affectedRows: 0, insertId: 0, warningStatus: 0 }, undefined ]
    // @ts-ignore
    return updated[0]?.affectedRows === 1
}

export async function handleFriendRequest(receiverId, senderId, action: 'confirm' | 'deny') {
    if (action === 'confirm'){
        generateNotification(receiverId, senderId, receiverId, ActivityType.FR_ACCEPTED, receiverId);
        return UserRelationShip.update({type: userRelationship.FRIEND}, {where: {receiverId, senderId}});
    }
    if (action === 'deny')
        return UserRelationShip.destroy({where: {receiverId, senderId}});
    throw new AppError(responseCodes.BAD_REQUEST, 'Invalid Action', `${action} is not a valid action for handling friend requests`)
}
