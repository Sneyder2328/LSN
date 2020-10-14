import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {getUserBasicInfo} from "../../modules/User/userActions";
import {NavBar} from "../../components/NavBar/NavBar";
import {DashBoardProfile} from "../../components/DashBoardProfile/DashBoardProfile";
import {CreatePost} from "../../components/CreatePost/CreatePost";
import {NewsFeed} from "../../components/NewsFeed/NewsFeed";
import styles from "./styles.module.scss"

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