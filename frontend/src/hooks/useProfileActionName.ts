import {RelationshipType, UserObject} from "../modules/User/userReducer";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {AppState} from "../modules/rootReducer";

type ActionType = 'Edit Profile' | 'Message' | 'Respond' | 'Cancel Request' | 'Add Friend' | undefined

const getActionName = (currentUserId: string, profileUserId: string, relationship: RelationshipType): ActionType => {
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
    const usersMetadata = useSelector((state: AppState) => state.users.metas)
    const [actionName, setActionName] = useState<ActionType>(undefined)
    const userMetadata = usersMetadata[userProfile?.userId || ''];

    useEffect(() => {
        userProfile && setActionName(getActionName(currentUserId, userProfile.userId, userMetadata?.relationship))
    }, [currentUserId, userProfile, userMetadata])

    return actionName
}