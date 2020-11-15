import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchConversations} from "../../../modules/Messages/messagesActions";
import {AppState} from "../../../modules/rootReducer";
import {Conversation} from "./Conversation";
import classNames from "classnames";
import styles from './styles.module.scss'
import stylesNav from '../styles.module.scss'
import {Dropdown} from "../../Dropdown/Dropdown";

export const ConversationsList = () => {
    const dispatch = useDispatch()
    const conversations = useSelector((state: AppState) => state.messages.conversations.entities)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    return (<Dropdown title={'Conversations'} className={styles.list}
                      trigger={<i className={classNames(stylesNav.icon, "fas fa-inbox")}/>}>
        {
            Object.values(conversations).map((conversation) => {
                return <Conversation key={conversation.conversationId} conversationId={conversation.conversationId}/>
            })
        }
    </Dropdown>)
}