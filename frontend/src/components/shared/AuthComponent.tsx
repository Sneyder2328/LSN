import React from "react";
import {Route} from "react-router-dom";
import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";


// @ts-ignore
export const AuthComponent = ({component: Component, ...rest}) => {
    const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated)

    return (<Route {...rest} render={(props: any) => (isAuthenticated ? <Component {...props}/>: null)}/>)
};