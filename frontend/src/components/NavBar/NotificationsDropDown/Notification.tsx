import React from "react";
import styles from './styles.module.scss'
import { ProfilePhoto } from "../../ProfilePhoto/ProfilePhoto";
import { Link } from "react-router-dom";
import { useNotification } from "../../NotificationSystem/NotificationPopUp";
import classNames from "classnames";

export const Notification: React.FC<{ notificationId: string }> = ({ notificationId }) => {
    const { notification, fullname, createdAt, text, link, status } = useNotification(notificationId)

    return (<Link to={link} className={styles.notification}>
        <ProfilePhoto size={'small2'} className={styles.image} url={notification.avatarUrl} />
        <div className={styles.content}>
            <div className={styles.textWrapper}>
                <span className={styles.text}><strong>{fullname}</strong>{text}</span>
                <div className={classNames(styles.status, { "hide": status === 'read' })} />
            </div>
            <span className={styles.createdAt}>{createdAt}</span>
        </div>

    </Link>)
}