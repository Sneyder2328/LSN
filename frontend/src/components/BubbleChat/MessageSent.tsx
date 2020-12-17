import React from "react";
import classNames from "classnames";
import {MessageObject} from "../../modules/Messages/messagesReducer";
import {UserObject} from "../../modules/User/userReducer";
import styles from './styles.module.scss'

type Props = {
    message: MessageObject;
    interlocutor: UserObject;
};
export const MessageSent: React.FC<Props> = ({message, interlocutor}) => {
    return (<div className={classNames(styles.message, styles.sent)}>
        <i className={classNames("fas fa-ellipsis-v", styles.icon)}/>
        <span className={styles.text}>{message?.content}</span>
    </div>)
}