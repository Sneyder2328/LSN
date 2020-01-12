import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./Auth";
import {Provider} from 'react-redux';
import {Home} from "./Home";
import AuthRoute from "./commons/AuthRoute";
import {PageNotFound} from "./commons/PageNotFound";
import store from "../store";
import jwt_decode from 'jwt-decode';
import {getTokens, removeTokens, isTokenExpired} from "../utils/tokensManager";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";
import {loggedOut, setCurrentUser} from "./Auth/authActions";
import {ONE_WEEK_IN_MILLIS} from "../utils/constants";

const {accessToken, refreshToken, dateRefreshTokenIssued} = getTokens();
const tokensExist = accessToken && refreshToken && dateRefreshTokenIssued;

if (!tokensExist || isTokenExpired(dateRefreshTokenIssued, ONE_WEEK_IN_MILLIS)) {
    removeAuthTokenHeaders();
    removeTokens();
    // clear current profile
    store.dispatch(loggedOut());
} else {
    setAccessTokenHeaders(accessToken);
    const decoded = jwt_decode<{ id: string }>(accessToken);
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
