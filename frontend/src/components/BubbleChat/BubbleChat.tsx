import React, { useEffect, useRef, useState } from "react";
import { ActiveChat, messagesActions } from "../../modules/Messages/messagesReducer";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../modules/rootReducer";
import styles from './styles.module.scss'
import { ProfilePhoto } from "../ProfilePhoto/ProfilePhoto";
import { Link } from "react-router-dom";
import { TextEditor } from "../shared/TextEditor";
import { genUUID } from "../../utils/utils";
import { Message } from "./Message";
import { fetchMessages } from "../../modules/Messages/messagesActions";
import { userLink } from "../../api";
// @ts-ignore
import Spinner from 'react-spinkit';
import { Scrollbar } from "react-scrollbars-custom";

export const BubbleChat: React.FC<{ chat: ActiveChat }> = ({ chat }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const [contentMessage, setContentMessage] = useState<string>('');
    const messagesByUser = useSelector((state: AppState) => state.messages.users)
    const messages = messagesByUser[chat.userId]?.messagesList
    const allMessagesLoaded = messagesByUser[chat.userId]?.allMessagesLoaded

    const loader = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })

    useEffect(() => {
        dispatch(fetchMessages(chat.userId))
    }, [dispatch, chat.userId])

    useEffect(() => {
        if (chat.isOpen) scrollToBottom()
    }, [chat.isOpen])

    useEffect(() => {
        const offset = 70
        const top = messagesEndRef?.current?.getBoundingClientRect().top || 0;
        const isCloseEnoughToBottom = top + offset >= 0 && top - offset <= window.innerHeight;
        if (isCloseEnoughToBottom || messages?.length <= 20) scrollToBottom();
    }, [messages])

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        // initialize IntersectionObserver
        // and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, options);
        console.log('trying to observe', loader.current);

        if (loader.current) {
            setTimeout(() => {
                loader.current && observer.observe(loader.current)
            }, 3000)
            console.log('observing');
        }

    }, []);

    // here we handle what happens when user scrolls to Load More div
    // in this case we just update page variable
    const handleObserver = (entities: any) => {
        const target = entities[0];
        if (target.isIntersecting) {
            console.log('is intersecting msgs');
            dispatch(fetchMessages(chat.userId))
        }
    }

    const users = useSelector((state: AppState) => state.users.entities)
    const user = users[chat.userId]
    // if (!user) return null

    const toggleBubbleChat = () => {
        if (chat.isOpen)
            dispatch(messagesActions.hideBubbleChat({ userId: chat.userId }))
        else
            dispatch(messagesActions.openBubbleChat({ userId: chat.userId }))
    }

    const closeBubbleChat = (e: Event) => {
        e.stopPropagation()
        dispatch(messagesActions.closeBubbleChat({ userId: chat.userId }))
    }

    const onSubmitMessage = () => {
        console.log('onSubmitMessage', contentMessage);
        if (contentMessage.trim() === '') return
        scrollToBottom()
        dispatch(messagesActions.sendMessage({
            event: 'createMessage',
            data: {
                id: genUUID(),
                content: contentMessage,
                typeContent: 'text',
                recipientId: chat.userId
            }
        }))
    }

    return (<div className={classNames(styles.bubbleChat, { [styles.hide]: !chat.isOpen })}>
        <div className={styles.header} onClick={toggleBubbleChat}>
            <div className={styles.userDetails}>
                <ProfilePhoto size={'small3'} url={user?.profilePhotoUrl} />
                <Link to={userLink(user?.username)}><span className={styles.title}>{user?.fullname}</span></Link>
            </div>
            <div className={styles.controls}>
                {chat.isOpen && <div className={'selectableBackground'}>
                    <i className="far fa-window-minimize selectableBackground" />
                </div>}
                <div className={'selectableBackground'}>
                    <i className="fas fa-times " onClick={closeBubbleChat} />
                </div>
            </div>
        </div>
        <Scrollbar className={classNames(styles.content, { [styles.hide]: !chat.isOpen })} thumbYProps={{
            style: {
                width: '8px',
                margin: '0 auto'
            }
        }} contentProps={{
            style: {
                padding: '4px 8px 0 8px'
            }
        }}>
            <div className={classNames(styles.loading, { 'hide': allMessagesLoaded || messages?.length < 10 })} ref={loader}>
                <Spinner name="ball-spin-fade-loader" color="aqua" />
            </div>
            {
                messages && [...messages]
                    .sort((msg1, msg2) => new Date(msg1.createdAt).getTime() - new Date(msg2.createdAt).getTime())
                    .map(({ messageId }) => <Message key={messageId} messageId={messageId} />)
            }
            <div ref={messagesEndRef} />
        </Scrollbar>
        <div className={classNames(styles.footer, { 'hide': !chat.isOpen })}>
            <TextEditor focusWhen={() => false} onChange={setContentMessage}
                placeholder={'Type a message'}
                className={styles.inputMessage}
                onEnter={onSubmitMessage}
                onEnterCleanUp={true} />
        </div>
    </div>)
}