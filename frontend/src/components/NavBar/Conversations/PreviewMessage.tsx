import styles from "./styles.module.scss";
import React from "react";
import {MessageObject} from "../../../modules/Messages/messagesReducer";
import {useTimeSincePublishedShort2} from "../../../hooks/updateRelativeTimeHook";

export const PreviewMessage: React.FC<{ message: MessageObject; sentByMe: boolean }> = ({message, sentByMe}) =>{
    const timeSinceLastMessage = useTimeSincePublishedShort2(message.createdAt)
    return (<span className={styles.lastMessage}>
        {(sentByMe ? 'You: ' : '') + message?.content} · {timeSinceLastMessage}
    </span>)
}