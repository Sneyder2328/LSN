import {SocketClient} from "./SocketClient";
import {Middleware} from "redux";
import {AppState} from "../rootReducer";
import {messagesActions} from "../Messages/messagesReducer";

export const socketMiddleware = (socket: SocketClient): Middleware<undefined, AppState> => ({dispatch, getState}) => {
    return (next) => (action) => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }

        /*
         * Socket middleware usage.
         * promise: (socket) => socket.emit('MESSAGE', 'hello world!')
         * type: always 'socket'
         * types: [REQUEST, SUCCESS, FAILURE]
         */
        const {payload, type, key, ...rest} = action;
        if (!payload) return next(action);

        /**
         * if already logged in or just logging in connect to websockets
         */
        if ((type === 'persist/REHYDRATE' && key === 'auth' && payload.refreshToken) || (type === 'auth/signInSuccess' && payload.refreshToken)) {
            socket.connect(payload.refreshToken).then(() => {
                console.log('connected!')
                socket.on('newMessage', (message: any) => {
                    console.log('newMessage received=', message);
                    dispatch(messagesActions.newMessageSuccess({
                        message,
                        interlocutorId: message.senderId === getState().auth.userId ? message.recipientId : message.senderId
                    }))
                }).then(r => console.log('listening to messages'))
            }).catch((err) => console.log('error connecting', err))
            return next(action);
        }

        /**
         * if log out the disconnect from websockets
         */
        if (type === 'auth/logOutSuccess') {
            socket.disconnect().then(() => console.log('disconnected!')).catch((err) => console.log('error disconnecting', err))
            return next(action);
        }

        const {event, data} = payload
        if (!event || !data) {
            // Move on! Not a socket request or a badly formed one.
            return next(action);
        }


        // const [REQUEST, SUCCESS, FAILURE] = types;
        next({...rest, type});

        return socket.emit(event, {
            ...data,
            senderToken: getState().auth.refreshToken
        }).then((result) => {
            return next({...rest, type, result});
        }).catch((error: any) => {
            console.log('error emitting', error);
            return next({...rest, type, error});
        })

        // return promise(socket)
        //     .then((result: any) => {
        //         return next({...rest, result, type: SUCCESS});
        //     })
        //     .catch((error: any) => {
        //         return next({...rest, error, type: FAILURE});
        //     })
    };
}