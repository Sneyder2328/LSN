import React from "react";
import {SearchBar} from "./SearchBar";
import {connect} from 'react-redux'
import {logOutUser} from "../../../actions/authActions";
import {AppState} from "../../../reducers";

const NavBar: React.FC<{ isLoggingOut: boolean; logOutUser: () => any }> = ({isLoggingOut, logOutUser}) => {
    return (
        <div id='nav-container'>
            <div id='nav-bar'>
                <SearchBar/>
                <button id='log-out-button' disabled={isLoggingOut} onClick={logOutUser}>Log out</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    return {isLoggingOut: state.auth.isLoggingOut};
};

export default connect(mapStateToProps, {logOutUser})(NavBar);