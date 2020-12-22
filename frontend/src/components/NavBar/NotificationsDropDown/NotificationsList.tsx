import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../modules/rootReducer";
import React, { useEffect } from "react";
import { Dropdown } from "../../Dropdown/Dropdown";
import styles from './styles.module.scss'
import classNames from "classnames";
import stylesNav from "../styles.module.scss";
import { loadNotifications } from "../../../modules/Notifications/notificationsActions";
import { Notification } from "./Notification";
import { NoContent } from "../NoContent/NoContent";

export const NotificationsList = () => {
    const dispatch = useDispatch()
    const { allIds } = useSelector((state: AppState) => state.notification)

    useEffect(() => {
        dispatch(loadNotifications())
    }, [dispatch])

    // return (<Dropdown className={classNames(styles.list, { [styles.empty]: conversationsAreEmpty })}
    const notificationsAreEmpty = allIds.length === 0
    return (<Dropdown title={'Notifications'} className={classNames(styles.list, { [styles.empty]: notificationsAreEmpty })}
        trigger={<i className={classNames(stylesNav.icon, "fas fa-bell")} />}>
        {allIds.map((notfId) => {
            return <Notification key={notfId} notificationId={notfId} />
        })}
        <NoContent display={notificationsAreEmpty} />
    </Dropdown>)
}