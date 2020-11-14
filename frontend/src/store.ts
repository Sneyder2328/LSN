import {createStore, compose, applyMiddleware, Action} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import {persistStore} from "redux-persist";
import {AppState, rootReducer} from "./modules/rootReducer";
import {socketMiddleware} from "./modules/middleware/socketMiddleware";
import {SocketClient} from "./modules/middleware/SocketClient";

// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const socketClient = new SocketClient();

export const store = createStore(
    rootReducer,
    composeEnhancer(
        applyMiddleware(thunk, socketMiddleware(socketClient))
    ),
);
export const persistor = persistStore(store);
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>