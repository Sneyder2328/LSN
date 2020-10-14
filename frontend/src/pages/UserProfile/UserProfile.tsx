import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RelationShipType} from "../../modules/User/userReducer";
import {AppState} from "../../modules/rootReducer";
import {fetchProfile} from "../../modules/User/userActions";
import {showModal} from "../../modules/Modal/modalsReducer";
import {EDIT_PROFILE_MODAL} from "../../components/Modals/ModalContainer";
import {NavBar} from "../../components/NavBar/NavBar";
import {CoverPhoto} from "../../components/shared/CoverPhoto";
import {ProfilePhoto} from "../../components/shared/ProfilePhoto";
import Post from "../../components/Post/Post";
import styles from "./styles.module.scss"

// const aspectRatio = 2.7;

type Props = {
    match: any;
};

const getActionName = (currentUserId: string, profileUserId: string, relationship: RelationShipType) => {
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

export const UserProfilePage: React.FC<Props> = ({match}) => {
    const {params} = match;
    const {username} = params;
    const dispatch = useDispatch()

    const currentUserId: string = useSelector((state: AppState) => state.auth.userId)!!
    const users = useSelector((state: AppState) => state.entities.users.entities)
    // const profiles = useSelector((state: AppState) => state.profiles)

    useEffect(() => {
        dispatch(fetchProfile(username, true))
    }, [dispatch]);

    const userId = Object.keys(users).find((userId) => users[userId].username === username)
    if (!userId) return null
    const userProfile = users[userId]
    const userPosts = users[userId].postsIds

    console.log('userProfile', userProfile);
    console.log('userPosts', userPosts);
    // if (!userProfile) return null

    const actionName = getActionName(currentUserId, userId, userProfile?.relationship)
    const handleUserAction = () => {
        switch (actionName) {
            case "Edit Profile":
                dispatch(showModal({modalType: EDIT_PROFILE_MODAL}))
            case "Add Friend":

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
                        <div className={styles.profileWrapper}>
                            <CoverPhoto className={styles.coverPhoto} url={userProfile?.coverPhotoUrl}/>
                            <div className={styles.userInfo}>
                                <div className={styles.photoAndActionsContainer}>
                                    <ProfilePhoto className={styles.profilePhoto} url={userProfile?.profilePhotoUrl}/>
                                    <a className={styles.actionBtn} onClick={handleUserAction}>{actionName}</a>
                                </div>
                                <span className={styles.fullname}>{userProfile?.fullname}</span>
                                <span className={styles.username}>@{userProfile?.username}</span>
                                <span className={styles.description}>{userProfile?.description}</span>
                            </div>
                        </div>
                        <div>
                            {userPosts?.map((postId: string) => <Post postId={postId} key={postId}/>)}
                        </div>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>

                    </div>
                </div>
            </main>
        </div>
    );
};