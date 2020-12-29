import React, { useEffect } from 'react';
import styles from './styles.module.scss'
import { NotificationPopUp } from "./NotificationPopUp";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../modules/rootReducer";
import { useQuery } from '../../utils/utils';
import { markNotfAsRead } from '../../modules/Notifications/notificationsActions';

export const NotificationSystem = () => {
    const dispatch = useDispatch()
    const query = useQuery()
    const notifsIds = useSelector((state: AppState) => state.notification.inDisplay)

    const refNotificationId = query.get('refNotificationId');
    useEffect(() => {
        console.log('NotificationSystem useEffect', refNotificationId);
        refNotificationId && dispatch(markNotfAsRead(refNotificationId))
    }, [refNotificationId])


    return (<div className={styles.section}>
        {notifsIds.map((notfId) => (<NotificationPopUp key={notfId} notificationId={notfId} />))}
    </div>)
}