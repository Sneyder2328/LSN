import React from "react";
import {SearchBar} from "./SearchBar";
import {useStateValue} from "../../../contexts/StateContext";
import {logOut} from "../../../actions/authActions";

export const NavBar = () => {
    const {state: {auth}, dispatch} = useStateValue();

    const handleLogOut = async (e: any) => {
        await logOut(dispatch);
    };
    return (
        <div id='nav-container'>
            <div id='nav-bar'>
                <SearchBar/>
                <button id='log-out-button' disabled={auth.isLoggingOut} onClick={handleLogOut}>Log out</button>
            </div>
        </div>
    );
};