import React, {useEffect} from "react";
import {Redirect, Route} from "react-router-dom";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../../utils/setAccessTokenHeaders";
import {getTokens, removeTokens} from "../../utils/tokensManager";
import {useHistory} from "react-router";
import {useStateValue} from "../../contexts/StateContext";

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
    const {state: {auth}} = useStateValue();
    const history = useHistory();
    useEffect(() => {
        if (!auth.isLoggedIn) history.push('/login');
    }, [auth]);
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