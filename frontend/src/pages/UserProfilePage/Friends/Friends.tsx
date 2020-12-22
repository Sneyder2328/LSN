import React, {useEffect} from 'react';
import styles from './styles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {fetchFriends} from "../../../modules/User/userActions";
import {AppState} from "../../../modules/rootReducer";
import {Friend} from "./Friend";

export const Friends: React.FC<{ userId?: string }> = ({userId}) => {
    const dispatch = useDispatch()
    const usersMetadata = useSelector((state: AppState) => state.users.metas)

    useEffect(() => {
        userId && dispatch(fetchFriends(userId))
    }, [userId, dispatch])

    if (!userId) return null
    const friends = usersMetadata[userId]?.friendsIds || []

    return (<div className={styles.friends}>
        <h3 className={styles.title}>Friends ({friends.length})</h3>
        <div className={styles.list}>
            {friends.map((userId) => (<Friend key={userId} userId={userId}/>))}
        </div>
    </div>)
}