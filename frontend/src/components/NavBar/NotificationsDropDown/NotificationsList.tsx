import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../modules/rootReducer";
import React, { useEffect } from "react";
import { Dropdown } from "../../Dropdown/Dropdown";
import styles from './styles.module.scss'
import classNames from "classnames";
import stylesNav from "../styles.module.scss";
import { ackNotifications, loadNotifications } from "../../../modules/Notifications/notificationsActions";
import { Notification } from "./Notification";
import { NoContent } from "../NoContent/NoContent";

export const NotificationsList = () => {
    const dispatch = useDispatch()
    const { allIds, unseenCount } = useSelector((state: AppState) => state.notification)

    useEffect(() => {
        dispatch(loadNotifications())
    }, [dispatch])

    const onNotfsOpened = (open: boolean) => {
        if (open) {
            console.log('opened!');
            dispatch(ackNotifications())
        }
    }

    const notificationsAreEmpty = allIds.length === 0

    return (<Dropdown title={'Notifications'} className={classNames(styles.list, { [styles.empty]: notificationsAreEmpty })} onOpen={onNotfsOpened}
        trigger={
            <div>
                <span className={classNames(stylesNav.countIndicator, { 'hide': !unseenCount })}>{unseenCount}</span>
                <i className={classNames(stylesNav.icon, "fas fa-bell")}></i>
            </div>
        }>
        {allIds.map((notfId) => {
            return <Notification key={notfId} notificationId={notfId} />
        })}
        <NoContent display={notificationsAreEmpty} />
    </Dropdown>)
}