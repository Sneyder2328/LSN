import {RelationShipType, UserObject} from "../modules/User/userReducer";
import {useEffect, useState} from "react";

type ActionType = 'Edit Profile' | 'Message' | 'Respond' | 'Cancel Request' | 'Add Friend' | undefined

const getActionName = (currentUserId: string, profileUserId: string, relationship: RelationShipType): ActionType => {
    console.log('getActionName', currentUserId, profileUserId, relationship);
    if (currentUserId === profileUserId)
        return 'Edit Profile'
    switch (relationship) {
        case "friend":
            return 'Message'
        case "blockedIncoming":
            return undefined
        case "blockedOutgoing":
            return undefined
        case "pendingIncoming":
            return "Respond"
        case "pendingOutgoing":
            return "Cancel Request"
        default:
            return "Add Friend"
    }
};

export const useProfileActionName = (currentUserId: string, userProfile?: UserObject) => {
    const [actionName, setActionName] = useState<ActionType>(undefined)

    useEffect(() => {
        console.log('useProfileActionName', currentUserId, userProfile);
        userProfile && setActionName(getActionName(currentUserId, userProfile.userId, userProfile.relationship))
    }, [currentUserId, userProfile])

    return actionName
}