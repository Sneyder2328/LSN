import React from "react";
import {NewsFeed} from "./NewsFeed";
import {CreatePost} from "./CreatePost";
import './styles.scss'
import {NavBar} from "./NavBar";

export const Home = () => {
    return (
        <div>
            <NavBar/>
            <div id='main'>
                <CreatePost/>
                <NewsFeed/>
            </div>
        </div>
    );
};