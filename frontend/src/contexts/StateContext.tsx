import React, {createContext, useContext, useReducer} from 'react';

const initialState = {};
export const StateContext = createContext(initialState);
// @ts-ignore
export const StateProvider = ({reducer, initialState, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);