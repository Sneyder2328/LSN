import React from "react";
import NewsFeed from "../NewsFeed/NewsFeed";
import CreatePost from "../CreatePost/CreatePost";
import './styles.scss'
import NavBar from "../NavBar/NavBar";
import {DashBoardProfile} from "../DashBoardProfile/DashBoardProfile";

export const Home = () => {
    return (
        <div>
            <NavBar/>
            <main>
                <div className='left-section'>
                    <DashBoardProfile/>
                </div>
                <div className='main-section'>
                    <CreatePost/>
                    <NewsFeed/>
                </div>
                <div className='right-section'>
                </div>
            </main>
        </div>
    );
};
