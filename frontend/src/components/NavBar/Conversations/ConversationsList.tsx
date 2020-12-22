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
    const conversations = useSelector((state: AppState) => state.messages.conversations.entities)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    const listConversations = Object.values(conversations);
    const conversationsAreEmpty = listConversations.length === 0;
    return (<Dropdown className={classNames(styles.list, { [styles.empty]: conversationsAreEmpty })} title={'Conversations'}
        trigger={<i className={classNames(stylesNav.icon, "fas fa-inbox")} />}>
        {listConversations.map((conversation) => {
            return <Conversation key={conversation.conversationId} conversationId={conversation.conversationId} />
        })}
        <NoContent display={conversationsAreEmpty}/>
    </Dropdown>)
}