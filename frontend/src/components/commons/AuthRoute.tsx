import React from "react";
import {Redirect, Route} from "react-router-dom";
import {AppState} from "../../reducers";
import {useSelector} from "react-redux";


// @ts-ignore
export const AuthRoute = ({component: Component, ...rest}) => {
    const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated)

    return (<Route {...rest} render={(props: any) => (
        isAuthenticated ? <Component {...props}/>
            : <Redirect to={
                {
                    pathname: '/login',
                    state: {from: props.location}
                }
            }/>
    )}/>)
};