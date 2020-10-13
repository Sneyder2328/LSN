import React from "react";
import {connect} from 'react-redux'
import {logOutUser} from "../Auth/authActions";
import {AppState} from "../../reducers";
import styles from './styles.module.scss'
import Logo from "./../../resources/lsn-ic.png";
import SearchBar from "../SearchBar/SearchBar";

const NavBar: React.FC<{ isLoggingOut: boolean; logOutUser: () => any }> = ({isLoggingOut, logOutUser}) => {
    return (
        <div className={styles.navContainer}>
            <div className={styles.navBar}>
                <div className={styles.newsFeedType}>
                    <ul className={styles.selected}><a href='/'>Top</a></ul>
                    <ul><a href='#'>Latest</a></ul>
                </div>
                <div className={styles.logoContainer}>
                    <img src={Logo} />
                </div>
                <SearchBar/>
                <button className={styles.logOutButton} disabled={isLoggingOut} onClick={logOutUser}>Log out</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    return {isLoggingOut: state.auth.isLoggingOut};
};

export default connect(mapStateToProps, {logOutUser})(NavBar);