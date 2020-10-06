import {createStore, compose, applyMiddleware, Action} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer, {AppState} from './reducers';

// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// @ts-ignore
const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk))
);
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>

export default store;

