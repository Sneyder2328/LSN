import React from 'react';
import styles from './styles.module.scss'
import {useSelector} from "react-redux";
import {AppState} from "../../../modules/rootReducer";
import {ProfilePhoto} from "../../../components/ProfilePhoto/ProfilePhoto";
import {Link} from "react-router-dom";
import {userLink} from "../../../api";

export const Friend: React.FC<{ userId: string }> = ({userId}) => {
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const user = users[userId]
    if (!user) return null

    return (<Link className={styles.friend} to={userLink(userId)}>
        <ProfilePhoto size={'small1'} url={user.profilePhotoUrl} className={styles.photo}/>
        <span className={styles.fullname}>{user.fullname}</span>
    </Link>)
}
