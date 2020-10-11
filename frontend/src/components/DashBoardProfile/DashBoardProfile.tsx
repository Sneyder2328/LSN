import React from "react";
import {useSelector} from "react-redux";
import {AppState} from "../../reducers";
import styles from './styles.module.scss'

export const DashBoardProfile = () => {
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const currentUser = users[userId]

    return (
        <div className={styles.dashboardProfile}>
            <img className={styles.coverPhoto}
                 src="https://newevolutiondesigns.com/images/freebies/galaxy-facebook-cover-1.jpg"
            />
            <img className={styles.profilePhoto} src="https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png"/>
            <div className={styles.profileName}>
                <p className={styles.fullname}>{currentUser && currentUser.fullname}</p>
                <p className={styles.username}>{currentUser && "@" + currentUser.username}</p>
            </div>
            <p className={styles.description}>{currentUser && currentUser.description}</p>
        </div>
    );
};
