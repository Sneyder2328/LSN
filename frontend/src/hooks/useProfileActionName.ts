import {RelationshipType, UserMetadata, UserObject} from "../modules/User/userReducer";
import {useEffect, useState} from "react";

type ActionType = 'Edit Profile' | 'Message' | 'Respond' | 'Cancel Request' | 'Add Friend' | undefined

const getActionName = (currentUserId: string, profileUserId: string, relationship: RelationshipType): ActionType => {
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

export const useProfileActionName = (currentUserId: string, userProfile?: UserObject, userMetadata?: UserMetadata) => {
    const [actionName, setActionName] = useState<ActionType>(undefined)

    useEffect(() => {
        console.log('useProfileActionName', currentUserId, userProfile);
        userProfile && userMetadata && setActionName(getActionName(currentUserId, userProfile.userId, userMetadata.relationship))
    }, [currentUserId, userProfile, userMetadata])

    return actionName
}