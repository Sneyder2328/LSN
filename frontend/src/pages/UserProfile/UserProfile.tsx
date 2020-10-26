import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserObject} from "../../modules/User/userReducer";
import {AppState} from "../../modules/rootReducer";
import {fetchProfile} from "../../modules/User/userActions";
import {NavBar} from "../../components/NavBar/NavBar";
import Post from "../../components/Post/Post";
import styles from "./styles.module.scss"
import {ProfileInfo} from "./ProfileInfo/ProfileInfo";

// const aspectRatio = 2.7;

type Props = {
    match: any;
};


export const UserProfilePage: React.FC<Props> = ({match}) => {
    const {params} = match;
    const {username} = params;
    const dispatch = useDispatch()

    const users = useSelector((state: AppState) => state.entities.users.entities)

    useEffect(() => {
        dispatch(fetchProfile(username, true))
    }, [dispatch, username]);

    const userId = Object.keys(users).find((userId) => users[userId].username === username)
    const userProfile: UserObject | undefined = users?.[userId || '']
    const userPosts: string[] | undefined = users?.[userId || '']?.postsIds || []

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className={styles.pageContainer + ' pageContainer'}>
                    <div className={styles.leftSection + ' leftSection'}>

                    </div>
                    <div className={styles.mainSection + ' mainSection'}>
                        <ProfileInfo userProfile={userProfile}/>
                        <div>
                            {userPosts?.map((postId: string) => <Post postId={postId} key={postId}/>)}
                        </div>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>

                    </div>
                </div>
            </main>
        </div>
    );
};