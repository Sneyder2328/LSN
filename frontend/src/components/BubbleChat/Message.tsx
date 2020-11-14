import React from 'react';
import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import styles from './styles.module.scss'
import classNames from "classnames";

export const Message: React.FC<{ messageId: string }> = ({messageId}) => {
    const userId = useSelector((state: AppState) => state.auth.userId)
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const messages = useSelector((state: AppState) => state.messages.entities)
    if (!users || !messages) return null
    const message = messages[messageId]
    const interlocutorId: string = userId === message.recipientId ? message.senderId : message.recipientId
    const interlocutor = users[interlocutorId]

    return (<div className={classNames(styles.message, {[styles.received]: userId === message.recipientId})}>
        {userId === message.recipientId && <ProfilePhoto size={'small3'} url={interlocutor.profilePhotoUrl}/>}
        <span className={styles.text}>{message.content}</span>
    </div>)
}