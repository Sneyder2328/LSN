import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../../modules/Messages/messagesActions";
import { AppState } from "../../../modules/rootReducer";
import { Conversation } from "./Conversation";
import classNames from "classnames";
import styles from './styles.module.scss'
import stylesNav from '../styles.module.scss'
import { Dropdown } from "../../Dropdown/Dropdown";
import { NoContent } from '../NoContent/NoContent';

export const ConversationsList = () => {
    const dispatch = useDispatch()
    const conversations = useSelector((state: AppState) => state.messages.conversations)
    const conversationsList = Object.keys(conversations)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])
    const conversationsAreEmpty = conversationsList.length === 0;
    return (<Dropdown className={classNames(styles.list, { [styles.empty]: conversationsAreEmpty })} title={'Conversations'}
        trigger={<i className={classNames(stylesNav.icon, "fas fa-inbox")} />}>
        {conversationsList.map((conversation) => {
            return <Conversation key={conversation} interlocutorId={conversation} />
        })}
        <NoContent display={conversationsAreEmpty} />
    </Dropdown>)
}