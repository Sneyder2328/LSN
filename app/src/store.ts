import {createStore, applyMiddleware} from 'redux';
import {persistStore} from 'redux-persist';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {Action, ThunkAction} from "@reduxjs/toolkit";
import {MyAppState, rootReducer} from "./modules/rootReducer";



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