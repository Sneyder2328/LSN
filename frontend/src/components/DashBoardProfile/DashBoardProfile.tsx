import React from "react";
import {useSelector} from "react-redux";
import styles from './styles.module.scss'
import {AppState} from "../../modules/rootReducer";
import {CoverPhoto} from "../CoverPhoto/CoverPhoto";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";

export const DashBoardProfile = () => {
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)
    const users = useSelector((state: AppState) => state.users.entities)
    const currentUser = users[userId]

    if (!currentUser) return null

    return (
        <div className={styles.dashboardProfile}>
            <CoverPhoto url={currentUser.coverPhotoUrl} className={styles.coverPhoto}/>
            <ProfilePhoto url={currentUser.profilePhotoUrl} className={styles.profilePhoto} size={'medium'} border={true}/>
            <div className={styles.profileName}>
                <p className={styles.fullname}>{currentUser && currentUser.fullname}</p>
                <p className={styles.username}>{currentUser && "@" + currentUser.username}</p>
            </div>
            <p className={styles.description}>{currentUser && currentUser.description}</p>
        </div>
    );
};
