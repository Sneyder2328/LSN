import React, {useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import {useDispatch, useSelector} from "react-redux";
import {fetchProfile} from "../UserProfile/profileActions";
import {AppState} from "../../reducers";
import styles from './styles.module.scss'
import Post from "../Post/Post";
import {CoverPhoto} from "../commons/CoverPhoto";
import {ProfilePhoto} from "../commons/ProfilePhoto";
import {showModal} from "../Modals/modalsReducer";
import {EDIT_PROFILE_MODAL} from "../Modals/ModalContainer";

// const aspectRatio = 2.7;

type Props = {
    match: any;
};

const getActionName = (currentUserId: string, profileUserId: string, friendship: "accepted" | "pendingIncoming" | "pendingOutgoing" | "blockedIncoming" | "blockedOutgoing" | undefined) => {
    if (currentUserId === profileUserId)
        return 'Edit Profile'
    switch (friendship) {
        case "accepted":
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

export const UserProfilePage: React.FC<Props> = ({match}) => {
    const {params} = match;
    const {username} = params;
    const dispatch = useDispatch()

    const currentUserId: string = useSelector((state: AppState) => state.auth.userId)!!
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const profiles = useSelector((state: AppState) => state.profiles)

    useEffect(() => {
        dispatch(fetchProfile(username, true))
    }, [dispatch]);

    const userId = Object.keys(profiles).find((userId) => profiles[userId].username === username)
    if (!userId) return null
    const userProfile = users[userId]
    const userPosts = profiles[userId].postsIds

    console.log('userProfile', userProfile);
    console.log('userPosts', userPosts);
    if (!userProfile) return null

    const actionName = getActionName(currentUserId, userId, userProfile.friendship)
    const handleUserAction = () => {
        switch (actionName) {
            case "Edit Profile":
                dispatch(showModal({modalType: EDIT_PROFILE_MODAL}))
            // case "Add Friend":
        }
    }

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className={styles.pageContainer + ' pageContainer'}>
                    <div className={styles.leftSection + ' leftSection'}>

                    </div>
                    <div className={styles.mainSection + ' mainSection'}>
                        <CoverPhoto className={styles.coverPhoto} url={userProfile.coverPhotoUrl}/>
                        <div className={styles.userInfo}>
                            <div className={styles.photoAndActionsContainer}>
                                <ProfilePhoto className={styles.profilePhoto} url={userProfile.profilePhotoUrl}/>
                                <a className={styles.actionBtn} onClick={handleUserAction}>{actionName}</a>
                            </div>
                            <span className={styles.fullname}>{userProfile.fullname}</span>
                            <span className={styles.username}>@{userProfile.username}</span>
                            <span className={styles.description}>{userProfile.description}</span>
                        </div>
                        <div>
                            {userPosts && userPosts.map((postId: string) => <Post postId={postId} key={postId}/>)}
                        </div>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>

                    </div>
                </div>
            </main>
        </div>
    );
};