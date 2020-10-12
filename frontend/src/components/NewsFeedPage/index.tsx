import React, {useEffect} from "react";
import NewsFeed from "../NewsFeed/NewsFeed";
import {CreatePost} from "../CreatePost/CreatePost";
import styles from './styles.module.scss'
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
            <main>
                <div className={styles.pageContainer + ' pageContainer'}>
                    <div className={styles.leftSection + ' leftSection'}>
                        <DashBoardProfile/>
                    </div>
                    <div className={styles.mainSection + ' mainSection'}>
                        <CreatePost/>
                        <NewsFeed/>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>
                    </div>
                </div>
            </main>
        </div>
    );
};