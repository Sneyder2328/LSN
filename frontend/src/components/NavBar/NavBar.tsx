import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'

import styles from './styles.module.scss'
import {SearchBar} from "../SearchBar/SearchBar";
import {CurrentProfileLink} from "../CurrentProfileLink/CurrentProfileLink";
import {Link} from "react-router-dom";
import {ConversationsList} from "./Conversations/ConversationsList";
import {AppState} from "../../modules/rootReducer";
import {getUserBasicInfo} from "../../modules/User/userActions";
import {NotificationsList} from "./NotificationsDropDown/NotificationsList";
import {OptionsDropDown} from "./OptionsDropDown/OptionsDropDown";

export const NavBar = () => {
    const dispatch = useDispatch()
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)

    useEffect(() => {
        dispatch(getUserBasicInfo(userId))
    }, [userId, dispatch]);

    return (
        <div className={styles.navContainer}>
            <div className={styles.navBar}>
                <div className={styles.leftHeader}>
                    <div className={styles.newsFeedType}>
                        <ul className={styles.selected}>
                            <Link to={'/'}>Top</Link>
                        </ul>
                        <ul>
                            <Link to={'/'}>Latest</Link>
                        </ul>
                    </div>
                    <SearchBar className={styles.search}/>
                </div>
                <div className={styles.logoContainer}>
                    <span style={{
                        fontWeight: 600,
                        width: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '48px',
                        backgroundColor: '#469EFA',
                        borderRadius: '50%',
                        position: 'relative',
                        left: '-50%',
                        color: '#fff'
                    }}>LSN</span>
                    {/*<img src={Logo}/>*/}
                </div>
                <div className={styles.rightHeader}>
                    <CurrentProfileLink className={styles.profileLink}/>
                    <ConversationsList/>
                    <NotificationsList/>
                    <OptionsDropDown/>
                </div>
            </div>
        </div>
    );
};