import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../modules/rootReducer";
import {ProfilePhoto} from "../../ProfilePhoto/ProfilePhoto";
import styles from './styles.module.scss'
import {messagesActions} from "../../../modules/Messages/messagesReducer";

type ConversationProps = {
    conversationId: string;
    onSelected?: () => void;
};
export const Conversation: React.FC<ConversationProps> = ({conversationId, onSelected}) => {
    const dispatch = useDispatch()
    const conversations = useSelector((state: AppState) => state.messages.conversations.entities)
    const conversation = conversations[conversationId]
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const interlocutor = users[conversation.interlocutorId]

    const handleConversationSelected = () => {
        console.log('handleConversationSelected clicked!')
        dispatch(messagesActions.openBubbleChat({userId: conversation.interlocutorId}))
        onSelected && onSelected()
    }
    return (<div className={styles.conversation} onClick={handleConversationSelected}>
        <ProfilePhoto size={'small2'} url={interlocutor?.profilePhotoUrl}/>
        <div className={styles.details}>
            <span className={styles.fullname}>{interlocutor?.fullname}</span>
            <span className={styles.lastMessage}>Sample last message</span>
        </div>
    </div>)
}