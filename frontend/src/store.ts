import {createStore, compose, applyMiddleware, Action} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer, {AppState} from './reducers';
import {persistStore} from "redux-persist";

// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// @ts-ignore
export const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>
