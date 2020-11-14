import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserMetadata, UserObject} from "../../modules/User/userReducer";
import {AppState} from "../../modules/rootReducer";
import {fetchProfile} from "../../modules/User/userActions";
import {NavBar} from "../../components/NavBar/NavBar";
import Post from "../../components/Post/Post";
import styles from "./styles.module.scss"
import {ProfileInfo} from "./ProfileInfo/ProfileInfo";
import {BottomMsgsBar} from "../../components/BottomMessagingBar/BottomMsgsBar";
import {LegalInfo} from "../../components/Legalnfo/LegalInfo";
import {UsersSuggestions} from "../../components/UsersSuggestions/UsersSuggestions";
import {Trends} from "../../components/Trends/Trends";
import {Friends} from "./Friends/Friends";

// const aspectRatio = 2.7;

type Props = {
    match: any;
};


export const UserProfilePage: React.FC<Props> = ({match}) => {
    const {params} = match;
    const {username} = params;
    const dispatch = useDispatch()

    const users = useSelector((state: AppState) => state.entities.users.entities)
    const usersMetadata = useSelector((state: AppState) => state.entities.users.metas)

    useEffect(() => {
        dispatch(fetchProfile(username, true))
    }, [dispatch, username]);

    const userId = Object.keys(users).find((userId) => users[userId].username === username)
    const userProfile: UserObject | undefined = users?.[userId || '']
    const userMetadata: UserMetadata | undefined = usersMetadata?.[userId || '']
    const userPosts: string[] | undefined = userMetadata?.postsIds || []

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className={styles.pageContainer + ' pageContainer'}>
                    <div className={styles.leftSection + ' leftSection'}>
                        <Friends userId={userId}/>
                    </div>
                    <div className={styles.mainSection + ' mainSection'}>
                        <ProfileInfo userProfile={userProfile}/>
                        <div>
                            {userPosts?.map((postId: string) => <Post postId={postId} key={postId}/>)}
                        </div>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>
                        <UsersSuggestions/>
                        <Trends/>
                        <LegalInfo/>
                    </div>
                </div>
            </main>
            <BottomMsgsBar/>
        </div>
    );
};