import userRelationship from "../../utils/constants/userRelationship";

import {AppError} from "../../utils/errors/AppError";
import responseCodes from "../../utils/constants/httpResponseCodes";
import {models} from "../../database/database";
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

/**
 * Get incoming friend requests in pending status by userId
 * @param userId
 */
export async function getFriendRequests(userId: string) {
    return UserRelationShip.findAll({where: {receiverId: userId, type: userRelationship.PENDING}});
}

export async function handleFriendRequest(receiverId, senderId, action: 'confirm' | 'deny') {
    if (action === 'confirm')
        return UserRelationShip.update({type: userRelationship.FRIEND}, {where: {receiverId, senderId}});
    if (action === 'deny')
        return UserRelationShip.destroy({where: {receiverId, senderId}});
    throw new AppError(responseCodes.BAD_REQUEST, 'Invalid Action', `${action} is not a valid action for handling friend requests`)
}
