import React from "react";
import classNames from "classnames";
import {MessageObject} from "../../modules/Messages/messagesReducer";
import {UserObject} from "../../modules/User/userReducer";
import styles from './styles.module.scss'
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";

type Props = {
    message: MessageObject;
    interlocutor: UserObject;
};
export const MessageReceived: React.FC<Props> = ({message, interlocutor}) => {
    return (<div className={classNames(styles.message, styles.received)}>
        <ProfilePhoto size={'small3'} url={interlocutor?.profilePhotoUrl}/>
        <span className={styles.text}>{message?.content}</span>
        <i className={classNames("fas fa-ellipsis-v", styles.icon)}/>
        {/* <span>{message.createdAt}</span> */}
    </div>)
}