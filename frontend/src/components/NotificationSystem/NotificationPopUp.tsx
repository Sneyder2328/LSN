import React from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {useTimeSincePublished} from "../../hooks/updateRelativeTimeHook";
import {ActivityType} from "../../modules/Notifications/notificationsApi";
import {postLink, userLink} from "../../api";
import {Link} from "react-router-dom";
import {notificationsActions} from "../../modules/Notifications/notificationsReducer";

export const NotificationPopUp: React.FC<{ notificationId: string }> = ({notificationId}) => {
    const {notification, fullname, createdAt, text, link} = useNotification(notificationId)
    const dispatch = useDispatch()

    return (<div className={styles.notification}>
        <div className={styles.header}>
            <span className={styles.title}>New Notification</span>
            <i className={classNames(styles.icon, 'fas fa-times')} onClick={() => {
                dispatch(notificationsActions.hideNotification(notificationId))
            }}/>
        </div>
        <Link to={link} className={styles.details}>
            <ProfilePhoto size={'medium'} className={styles.image} url={notification.avatarUrl}/>
            <div className={styles.content}>
                <span className={styles.text}><strong>{fullname}</strong>{text}</span>
                <span className={styles.createdAt}>{createdAt}</span>
            </div>
        </Link>
    </div>)
}


const getLinkForNotification = (activityType: "post_commented" | "comment_liked" | "post_liked" | "post_shared" | "friendrequest_incoming" | "friendrequest_accepted", objectId: string) => {
    console.log('getLinkForNotification', activityType, objectId)
    switch (activityType) {
        case ActivityType.POST_LIKED:
        case ActivityType.POST_COMMENTED:
        case ActivityType.POST_SHARED:
        case ActivityType.COMMENT_LIKED:
            return postLink(objectId)
        case ActivityType.FR_ACCEPTED:
        case ActivityType.FR_INCOMING:
            return userLink(objectId)
    }
    throw new Error(`Activity ${activityType} not valid`)
};

export const useNotification = (notificationId: string) => {
    console.log('useNotification', notificationId)
    const notifications = useSelector((state: AppState) => state.notification.entities)
    const notification = notifications[notificationId]
    const createdAt = useTimeSincePublished(notification.createdAt)
    const fullname = notification.title.slice(8, notification.title.indexOf('</strong>'))
    const text = notification.title.slice(notification.title.indexOf('</strong>') + 9)
    const link = getLinkForNotification(notification.activityType, notification.activityId)

    console.log('useNotification returning', notificationId, 'notf=', notification)
    return {
        notification, createdAt, fullname, text, link
    }
}