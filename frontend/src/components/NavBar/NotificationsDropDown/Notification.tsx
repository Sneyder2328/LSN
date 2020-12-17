import React from "react";
import styles from './styles.module.scss'
import {ProfilePhoto} from "../../ProfilePhoto/ProfilePhoto";
import {Link} from "react-router-dom";
import {useNotification} from "../../NotificationSystem/NotificationPopUp";

export const Notification: React.FC<{ notificationId: string }> = ({notificationId}) => {
    const {notification, fullname, createdAt, text, link} = useNotification(notificationId)

    return (<Link to={link} className={styles.notification}>
        <ProfilePhoto size={'small2'} className={styles.image} url={notification.avatarUrl}/>
        <div className={styles.content}>
            <span className={styles.text}><strong>{fullname}</strong>{text}</span>
            <span className={styles.createdAt}>{createdAt}</span>
        </div>
    </Link>)
}