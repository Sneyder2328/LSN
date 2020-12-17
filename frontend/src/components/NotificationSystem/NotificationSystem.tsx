import React from 'react';
import styles from './styles.module.scss'
import {NotificationPopUp} from "./NotificationPopUp";
import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";

export const NotificationSystem = () => {
    const notifsIds = useSelector((state: AppState) => state.notification.inDisplay)

    return (<div className={styles.section}>
        {notifsIds.map((notfId) => (<NotificationPopUp key={notfId} notificationId={notfId}/>))}
    </div>)
}