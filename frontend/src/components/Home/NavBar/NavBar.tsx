import React from "react";
import {SearchBar} from "./SearchBar";

export const NavBar = () => {
    return (
        <div id='nav-container'>
            <div id='nav-bar'>
                <SearchBar/>
                <button id='log-out-button' >Log out</button>
            </div>
        </div>
    );
};