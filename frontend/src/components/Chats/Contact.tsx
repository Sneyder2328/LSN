import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import styles from './styles.module.scss'
import {messagesActions} from "../../modules/Messages/messagesReducer";
const {openBubbleChat} = messagesActions

export const Contact: React.FC<{ userId: string }> = ({userId}) => {
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const dispatch = useDispatch()
    const user = users[userId]
    if (!user) return null
    return (<div className={styles.contact} onClick={()=>{
        dispatch(openBubbleChat({userId}))
    }}>
        <ProfilePhoto size={'small2'} url={user.profilePhotoUrl}/>
        <span className={styles.fullname}>{user.fullname}</span>
    </div>)
}