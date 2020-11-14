import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {getUserBasicInfo} from "../../modules/User/userActions";
import {NavBar} from "../../components/NavBar/NavBar";
import {DashBoardProfile} from "../../components/DashBoardProfile/DashBoardProfile";
import {CreatePost} from "../../components/CreatePost/CreatePost";
import {NewsFeed} from "../../components/NewsFeed/NewsFeed";
import styles from "./styles.module.scss"
import {BottomMsgsBar} from "../../components/BottomMessagingBar/BottomMsgsBar";
import {LegalInfo} from "../../components/Legalnfo/LegalInfo";
import {UsersSuggestions} from "../../components/UsersSuggestions/UsersSuggestions";
import {Trends} from "../../components/Trends/Trends";

// import io from "socket.io-client";
//
// let socket: SocketIOClient.Socket | null = null;
//
// export const initiateSocket = (room: string) => {
//     socket = io('http://localhost:3000');
//
//     // socket = io.connect(
//     //     process.env.NODE_ENV === 'development'
//     //         ? `https://localhost:3002/`
//     //         : `https://api.mydomain.com/`
//     //     , {
//     //         transports: ['websocket'],
//     //         rejectUnauthorized: false,
//     //         secure: true
//     //     });
//
//     console.log(`Connecting socket...`);
//     if (socket && room) socket.emit('join', room);
// }
//
// export const disconnectSocket = () => {
//     console.log('Disconnecting socket...');
//     try {
//         if (socket) socket.disconnect();
//     } catch (err) {
//         console.log('some error, probably cause socket not connected', err);
//     }
// }
// export const subscribeToChat = (cb: (error: Error | null, msg: any) => any) => {
//     if (!socket) return
//     socket.on('message', (msg: any) => {
//         console.log('Websocket event received!');
//         return cb(null, msg);
//     });
// }
// export const sendMessage = (room: string, message: any) => {
//     if (socket) socket.emit('message', {message, room});
// }
//
// const useSocket = () => {
//     const dispatch = useDispatch()
//     const {userId} = useSelector((state: AppState) => state.auth)
//
//     useEffect(() => {
//         if (userId) initiateSocket(userId);
//         subscribeToChat((err, data) => {
//             if (err) return console.log('error subcribing to chat', err);
//             console.log('data del chat', data);
//             dispatch(newMessage(data))
//             // setChat(oldChats => [data, ...oldChats])
//         });
//         return () => {
//             disconnectSocket();
//         }
//     }, [userId]);
// }

export const NewsFeedPage = () => {
    const dispatch = useDispatch()
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)

    useEffect(() => {
        dispatch(getUserBasicInfo(userId))
    }, [userId, dispatch]);

    return (
        <div>
            <NavBar/>
            <main>
                <div className={styles.pageContainer + ' pageContainer'}>
                    <div className={styles.leftSection + ' leftSection'}>
                        <DashBoardProfile/>
                        <Trends/>
                    </div>
                    <div className={styles.mainSection + ' mainSection'}>
                        <CreatePost/>
                        <NewsFeed/>
                    </div>
                    <div className={styles.rightSection + ' rightSection'}>
                        <UsersSuggestions/>
                        <LegalInfo/>
                    </div>
                </div>
            </main>
            <BottomMsgsBar/>
        </div>
    );
};