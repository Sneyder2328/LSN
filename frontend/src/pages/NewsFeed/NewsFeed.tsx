import React from "react";
import {DashBoardProfile} from "../../components/DashBoardProfile/DashBoardProfile";
import {CreatePost} from "../../components/CreatePost/CreatePost";
import {NewsFeed} from "../../components/NewsFeed/NewsFeed";
import {LegalInfo} from "../../components/Legalnfo/LegalInfo";
import {UsersSuggestions} from "../../components/UsersSuggestions/UsersSuggestions";
import {Trends} from "../../components/Trends/Trends";
import {ThreeSectionsPage} from "../layouts/3Sections/3SectionsPage";

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
    return (<ThreeSectionsPage LeftComponents={
        <>
            <DashBoardProfile/>
            <Trends/>
        </>
    } MainComponents={
        <>
            <CreatePost/>
            <NewsFeed/>
        </>
    } RightComponents={
        <>
            <UsersSuggestions/>
            <LegalInfo/>
        </>
    }/>)
}