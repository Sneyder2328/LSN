import React from "react";
import NewsFeed from "../NewsFeed/NewsFeed";
import CreatePost from "../CreatePost/CreatePost";
import './styles.scss'
import NavBar from "../NavBar/NavBar";

export const Home = () => {
    return (
        <div>
            <NavBar/>
            <main>
                <CreatePost/>
                <NewsFeed/>
            </main>
        </div>
    );
};