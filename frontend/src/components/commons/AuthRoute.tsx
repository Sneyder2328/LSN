import React from "react";
import {Redirect, Route} from "react-router-dom";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../../utils/setAccessTokenHeaders";
import {getTokens, removeTokens} from "../../utils/tokensManager";

const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;

const isUserAuth = () => {
    const {accessToken, refreshToken, dateRefreshTokenIssued} = getTokens();
    const expiryDate = dateRefreshTokenIssued + oneWeekInMillis;
    const currentDate = new Date().getTime();
    const tokensExist = accessToken && refreshToken && dateRefreshTokenIssued;
    if (!tokensExist) return false;
    const isTokenExpired = (expiryDate <= currentDate);
    if (isTokenExpired) {
        removeAuthTokenHeaders();
        removeTokens();
    } else {
        setAccessTokenHeaders(accessToken);
    }
    return !isTokenExpired;
};

// @ts-ignore
export const AuthRoute = ({component: Component, ...rest}) => {
    return <Route {...rest} render={(props: any) => (
        isUserAuth() ? <Component {...props}/>
            : <Redirect to={
                {
                    pathname: '/login',
                    state: {from: props.location}
                }
            }/>
    )}
    />
};