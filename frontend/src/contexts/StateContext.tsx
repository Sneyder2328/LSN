import React, {createContext, useContext, useReducer} from 'react';
import {AppState} from "../reducers";

export const initState = {
    auth: {},
    post: {}
} as AppState;

interface ContextProps {
    state: AppState;
    dispatch: ({type}: { type: string }) => void;
}

export const StateContext = createContext({state: initState} as ContextProps);

type Props = {
    reducer: (state: AppState, action: any) => AppState;
    initialState: AppState;
    children: any
};

export const StateProvider: React.FC<Props> = ({reducer, initialState, children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    );
};
export const useStateValue = () => useContext(StateContext);