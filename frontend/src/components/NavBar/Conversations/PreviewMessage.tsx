import styles from "./styles.module.scss";
import React from "react";
import {MessageObject} from "../../../modules/Messages/messagesReducer";
import {useTimeSincePublishedShort} from "../../../hooks/updateRelativeTimeHook";

export const PreviewMessage: React.FC<{ message: MessageObject; sentByMe: boolean }> = ({message, sentByMe}) =>{
    const timeSinceLastMessage = useTimeSincePublishedShort(message.createdAt)
    return (<span className={styles.lastMessage}>
        {(sentByMe ? 'You: ' : '') + message?.content} · {timeSinceLastMessage}
    </span>)
}