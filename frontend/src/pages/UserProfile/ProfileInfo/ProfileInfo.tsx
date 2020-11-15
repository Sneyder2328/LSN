import {UserObject} from "../../../modules/User/userReducer";
import {CoverPhoto} from "../../../components/CoverPhoto/CoverPhoto";
import {ProfilePhoto} from "../../../components/ProfilePhoto/ProfilePhoto";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {Button} from "../../../components/Button/Button";
import React from "react";
import {showModal} from "../../../modules/Modal/modalsReducer";
import {EDIT_PROFILE_MODAL} from "../../../components/Modals/ModalContainer";
import {removeFriendship, respondToFriendRequest, sendFriendRequest} from "../../../modules/User/userActions";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../modules/rootReducer";
import styles from './styles.module.scss'
import {useProfileActionName} from "../../../hooks/useProfileActionName";
import {FriendRequestActionType} from "../../../modules/User/userApi";
import {messagesActions} from "../../../modules/Messages/messagesReducer";

export type ProfileInfoProps = {
    userProfile?: UserObject;
}
export const ProfileInfo: React.FC<ProfileInfoProps> = ({userProfile}) => {
    const dispatch = useDispatch()
    const currentUserId: string = useSelector((state: AppState) => state.auth.userId)!!
    const actionName = useProfileActionName(currentUserId, userProfile)

    const handleUserAction = () => {
        if (!userProfile) return
        switch (actionName) {
            case "Edit Profile":
                dispatch(showModal({modalType: EDIT_PROFILE_MODAL}))
                break
            case "Add Friend":
                dispatch(sendFriendRequest(userProfile.userId))
                break
            case "Cancel Request":
                dispatch(removeFriendship(userProfile.userId))
                break
            case "Message":
                dispatch(messagesActions.openBubbleChat({userId: userProfile.userId}))
                break
        }
    }

    const handleResponseToFriendRequest = (action: FriendRequestActionType) => {
        if (!userProfile) return
        dispatch(respondToFriendRequest(userProfile.userId, action))
    };

    let actionButton = null
    if (actionName) {
        actionButton = actionName === 'Respond' ? <Dropdown trigger={<Button
            className={styles.actionBtn}
            onClick={handleUserAction}
            label={actionName}/>}>
            <Dropdown.Item
                label={'Accept'}
                onClick={() => handleResponseToFriendRequest('confirm')}
                icon={() => <i className="fas fa-check"/>}/>
            <Dropdown.Item
                label={'Deny'}
                onClick={() => handleResponseToFriendRequest('deny')}
                icon={() => <i className="fas fa-times"/>}/>
        </Dropdown> : (<Button
            className={styles.actionBtn}
            onClick={handleUserAction}
            label={actionName}/>)
    }

    return (
        <div className={styles.profileWrapper}>
            <CoverPhoto className={styles.coverPhoto} url={userProfile?.coverPhotoUrl}/>
            <div className={styles.userInfo}>
                <div className={styles.photoAndActionsContainer}>
                    <ProfilePhoto className={styles.profilePhoto}
                                  size={'large'} border={true}
                                  url={userProfile?.profilePhotoUrl}/>
                    {actionButton}
                </div>
                <span className={styles.fullname}>{userProfile?.fullname}</span>
                <span className={styles.username}>@{userProfile?.username}</span>
                <span className={styles.description}>{userProfile?.description}</span>
            </div>
        </div>
    )
}
