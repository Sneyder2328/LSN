import React, {useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import {useDispatch, useSelector} from "react-redux";
import {UserObject} from "../User/userReducer";
import {fetchProfile} from "../UserProfile/profileActions";
import {AppState} from "../../reducers";
import {useWindowDimensions} from "../../utils/utils";
// import styles from './styles/.'
import styles from './styles.module.scss'
import Post from "../Post/Post";
// import * from "../../../public/ic_person"

const aspectRatio = 2.7;

type Props = {
    user: UserObject;
    match: any;
};
export const UserProfilePage: React.FC<Props> = ({user, match}) => {
    const {params} = match;
    const {username} = params;
    const dispatch = useDispatch()

    const {height, width} = useWindowDimensions();

    const posts = useSelector((state: AppState) => state.entities.posts.entities)
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const profiles = useSelector((state: AppState) => state.profiles)

    useEffect(() => {
        console.log('dispatch(fetchProfile(username, true))');
        dispatch(fetchProfile(username, true))
    }, [dispatch]);

    const userId = Object.keys(profiles).find((userId) => profiles[userId].username === username)
    if (!userId) return null
    const userProfile = users[userId]
    const userPosts = profiles[userId].postsIds

    console.log('userProfile', userProfile);
    console.log('userPosts', userPosts);
    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className={styles.pageContainer}>
                    <div className={styles.leftSection}>
                        {/*<UserProfile user={user}/>*/}
                    </div>
                    <div className={styles.mainSection}>
                        {userProfile && <div>
                            {userProfile.coverPhotoUrl.length !== 0 ? (<img className={styles.coverPhoto} src={userProfile.coverPhotoUrl}/>)
                            : <div className={styles.coverPhoto}/>}

                            <div className={styles.userInfo}>
                                <img className={styles.profilePhoto} src={userProfile.profilePhotoUrl  || 'ic_person.png'} alt={'profile photo'}/>
                                <span className={styles.fullname}>{userProfile.fullname}</span>
                                <span className={styles.username}>@{userProfile.username}</span>
                                <span className={styles.description}>{userProfile.description}</span>
                            </div>
                            <div>
                                {userPosts && userPosts.map((postId: string) => <Post postId={postId} key={postId}/>)}
                            </div>
                        </div>}
                    </div>
                    <div className={styles.rightSection}>

                    </div>
                </div>
            </main>
        </div>
    );
};