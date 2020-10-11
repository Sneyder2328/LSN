import React, {useEffect} from "react";
import NewsFeed from "../NewsFeed/NewsFeed";
import {CreatePost} from "../CreatePost/CreatePost";
import './styles.scss'
import NavBar from "../NavBar/NavBar";
import {DashBoardProfile} from "../DashBoardProfile/DashBoardProfile";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../reducers";
import {getUserBasicInfo} from "../User/userActions";

export const NewsFeedPage = () => {
    const dispatch = useDispatch()
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)

    useEffect(() => {
        dispatch(getUserBasicInfo(userId))
    }, [userId, dispatch]);

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className='page-container'>
                    <div className='left-section'>
                        <DashBoardProfile/>
                    </div>
                    <div className='main-section'>
                        <CreatePost/>
                        <NewsFeed/>
                    </div>
                    <div className='right-section'>
                    </div>
                </div>
            </main>
        </div>
    );
};