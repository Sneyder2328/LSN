import React from "react";
import {NewsFeed} from "./NewsFeed";
import {CreatePost} from "./CreatePost";
import {SearchBar} from "./SearchBar";
import './styles.scss'

export const Home = () => {
    return (
        <div>
            <SearchBar/>
            <div id='main'>
                <CreatePost/>
                <NewsFeed/>
            </div>
        </div>
    );
};