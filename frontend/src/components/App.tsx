import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./AuthForm";
import {Provider} from 'react-redux';
import {Home} from "./Home";
import AuthRoute from "./commons/AuthRoute";
import {PageNotFound} from "./commons/PageNotFound";
import store from "../store";
import jwt_decode from 'jwt-decode';
import {getTokens, removeTokens} from "../utils/tokensManager";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";
import {loggedOut, setCurrentUser} from "../actions/authActions";


const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;

const {accessToken, refreshToken, dateRefreshTokenIssued} = getTokens();
const expiryDate = dateRefreshTokenIssued + oneWeekInMillis;
const currentDate = new Date().getTime();
const tokensExist = accessToken && refreshToken && dateRefreshTokenIssued;
const isTokenExpired = (expiryDate <= currentDate);

if (!tokensExist || isTokenExpired) {
    removeAuthTokenHeaders();
    removeTokens();
    // clear current profile
    store.dispatch(loggedOut());
} else {
    setAccessTokenHeaders(accessToken);
    const decoded = jwt_decode(accessToken);
    // @ts-ignore
    store.dispatch(setCurrentUser(decoded.id));
}

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/login' component={AuthForm}/>
                    <AuthRoute exact path='/' component={Home}/>
                    <Route path='*' component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
