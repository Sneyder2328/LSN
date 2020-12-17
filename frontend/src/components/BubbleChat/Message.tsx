import React from 'react';
import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {MessageReceived} from "./MessageReceived";
import {MessageSent} from "./MessageSent";

export const Message: React.FC<{ messageId: string }> = ({messageId}) => {
    const userId = useSelector((state: AppState) => state.auth.userId)
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const messages = useSelector((state: AppState) => state.messages.entities)
    if (!users || !messages) return null
    const message = messages[messageId]
    const isReceived = userId === message.recipientId;
    const interlocutorId: string = isReceived ? message.senderId : message.recipientId
    const interlocutor = users[interlocutorId]

    if (isReceived) return <MessageReceived message={message} interlocutor={interlocutor}/>
    return <MessageSent message={message} interlocutor={interlocutor}/>
}