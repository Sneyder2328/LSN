import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import {createLogger} from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';
// @ts-ignore
import thunk from 'redux-thunk';
import {MyAppState, rootReducer} from "./reducers/rootReducer";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import {migrations} from "./reducers/migrations";
import {Action, ThunkAction} from "@reduxjs/toolkit";



// const persistConfig = {
//     key: 'root',
//     storage: AsyncStorage,
//     version: 0,
//     // @ts-ignore
//     migrate: createMigrate(migrations, { debug: true }),
//     // stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
// };

//const pReducer = persistReducer(persistConfig, mainReducer);
// @ts-ignore
export const store = createStore(rootReducer, applyMiddleware(createLogger(), thunk));
export const persistor = persistStore(store);
export type AppThunk = ThunkAction<void, MyAppState, unknown, Action<string>>