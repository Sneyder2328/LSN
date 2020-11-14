import React from "react";
import styles from './styles.module.scss'
import {Chats} from "../Chats/Chats";
import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {BubbleChat} from "../BubbleChat/BubbleChat";

export const BottomMsgsBar = () => {
    const activeChats = useSelector((state: AppState) => state.messages.activeChats)

    return (<div className={styles.bottomBar}>
        {
            activeChats?.map((chat) => <BubbleChat key={chat.userId} chat={chat}/>)
        }
        <Chats/>
    </div>)
}