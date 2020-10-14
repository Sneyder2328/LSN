import React from "react";
import {useDispatch, useSelector} from 'react-redux'

import styles from './styles.module.scss'
import Logo from "./../../resources/lsn-ic.png";
import {SearchBar} from "../SearchBar/SearchBar";
import {AppState} from "../../modules/rootReducer";
import {logOutUser} from "../../modules/Auth/authActions";

export const NavBar = () => {
    const dispatch = useDispatch()
    const isLoggingOut = useSelector((state: AppState) => state.auth.isLoggingOut)

    const handleLogOut = () => dispatch(logOutUser());

    return (
        <div className={styles.navContainer}>
            <div className={styles.navBar}>
                <div className={styles.newsFeedType}>
                    <ul className={styles.selected}><a href='/'>Top</a></ul>
                    <ul><a href='#'>Latest</a></ul>
                </div>
                <div className={styles.logoContainer}>
                    <img src={Logo}/>
                </div>
                <SearchBar/>
                <button className={styles.logOutButton} disabled={isLoggingOut}
                        onClick={handleLogOut}>Log out
                </button>
            </div>
        </div>
    );
};