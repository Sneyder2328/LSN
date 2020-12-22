import React from "react";
import {UserSuggestion} from "../../modules/User/userReducer";
import styles from './styles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import {removeUserSuggestion, sendFriendRequest} from "../../modules/User/userActions";
import {Link} from "react-router-dom";
import {userLink} from "../../api";

export const UserSuggested: React.FC<{ suggestion: UserSuggestion }> = ({suggestion}) => {
    const dispatch = useDispatch()
    const users = useSelector((state: AppState) => state.users.entities)
    const user = users[suggestion.userId]
    if (!user) return null

    const handleSendFriendRequest = () => dispatch(sendFriendRequest(suggestion.userId))

    const removeSuggestion = () => dispatch(removeUserSuggestion(suggestion.userId))

    return (<div className={styles.suggestion}>
        <ProfilePhoto size={'small1'} url={user.profilePhotoUrl}/>
        <div className={styles.userDetails}>
            <div>
                <Link to={userLink(user.username)}><span className={styles.fullname}>{user.fullname}</span></Link>
                {/*<span className={styles.fullname}>{user.fullname}</span>*/}
                {/*<span className={styles.username}>@{user.username}</span>*/}
            </div>
            <div className={styles.actions}>
                <button onClick={handleSendFriendRequest}>Add Friend</button>
                <button className={styles.remove} onClick={removeSuggestion}>Remove</button>
            </div>
        </div>
    </div>)
}