import {createStore, applyMiddleware} from 'redux';
// @ts-ignore
import thunk from 'redux-thunk';
import {mainReducer} from "./mainReducer";

// @ts-ignore
export const store = createStore(mainReducer, applyMiddleware(thunk));


