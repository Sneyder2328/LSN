import React from "react";
import SearchBar from "./SearchBar";
import {connect} from 'react-redux'
import {logOutUser} from "../Auth/authActions";
import {AppState} from "../../reducers";
import './styles.scss'
import Logo from "./../../resources/lsn-ic.png";

const NavBar: React.FC<{ isLoggingOut: boolean; logOutUser: () => any }> = ({isLoggingOut, logOutUser}) => {
    return (
        <div className='nav-container'>
            <div className='nav-bar'>
                <div className='news-feed-type'>
                    <ul className='selected'><a href='/'>Top</a></ul>
                    <ul><a href='#'>Latest</a></ul>
                </div>
                <div className='logo-container'>
                    <img src={Logo} />
                </div>
                <SearchBar/>
                <button className='log-out-button' disabled={isLoggingOut} onClick={logOutUser}>Log out</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    return {isLoggingOut: state.auth.isLoggingOut};
};

export default connect(mapStateToProps, {logOutUser})(NavBar);