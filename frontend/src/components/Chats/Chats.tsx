import React, {useEffect, useState} from 'react';
import styles from './styles.module.scss'
import {Search} from "./Search";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {fetchFriends} from "../../modules/User/userActions";
import {AppState} from "../../modules/rootReducer";
import {Contact} from "./Contact";

export const Chats = () => {
    const [isOpen, setIsOpen] = useState<Boolean>(true)
    const dispatch = useDispatch()
    const usersMetadata = useSelector((state: AppState) => state.users.metas)
    const {userId} = useSelector((state: AppState) => state.auth)
    const friends = usersMetadata[userId!]?.friendsIds || []

    useEffect(() => {
        userId && dispatch(fetchFriends(userId))
    }, [dispatch, userId])

    return (<div className={classNames(styles.chats)}>
        <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.details}>
                <span className={styles.title}>Chat</span>
                <div className={styles.dot}/>
            </div>
            <div className={styles.control}>
                <div className={'selectableBackground'}>
                    <i className="fas fa-edit"/>
                </div>
                <div className={'selectableBackground'}>
                    <i className="fas fa-ellipsis-h"/>
                </div>
                <div className={'selectableBackground'}>
                    <i className={"fas fa-angle-" + (isOpen ? 'down' : 'up')}/>
                </div>
            </div>
        </div>
        <div className={classNames(styles.contacts, {[styles.hide]: !isOpen})}>
            {
                friends.map((userId) => <Contact key={userId} userId={userId}/>)
            }
        </div>
        <Search className={classNames({[styles.hide]: !isOpen})}/>
    </div>)
}