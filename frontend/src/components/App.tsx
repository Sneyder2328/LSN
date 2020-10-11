import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./Auth";
import {Provider} from 'react-redux';
import {NewsFeedPage} from "./NewsFeedPage";
import {AuthRoute} from "./commons/AuthRoute";
import {PageNotFound} from "./commons/PageNotFound";
import {persistor, store} from "../store";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";
import {UserProfilePage} from "./UserProfilePage/UserProfilePage";
import {PersistGate} from "redux-persist/integration/react";

// const tokensExist = accessToken && refreshToken && dateRefreshTokenIssued;

// if (!tokensExist || isTokenExpired(dateRefreshTokenIssued, ONE_WEEK_IN_MILLIS)) {
//     removeAuthTokenHeaders();
//     removeTokens();
//     // clear current profile
//     store.dispatch(loggedOut());
// } else {
//     setAccessTokenHeaders(accessToken);
//     const decoded = jwt_decode<{ id: string }>(accessToken);
//     store.dispatch(setCurrentUser(decoded.id));
// }

export const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/login' component={AuthForm}/>
                        <AuthRoute exact path='/' component={NewsFeedPage}/>
                        <AuthRoute path='/:username' component={UserProfilePage}/>
                        <Route path='*' component={PageNotFound}/>
                    </Switch>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
};

let currentValue: string | undefined

const handleChange = () => {
    const previousValue = currentValue
    currentValue = store.getState().auth.accessToken

    if (previousValue !== currentValue) {
        console.log('accessToken changed from', previousValue, 'to', currentValue)
        if (currentValue) {
            setAccessTokenHeaders(currentValue);
        } else if (previousValue) {
            removeAuthTokenHeaders()
        }
    }
};

store.subscribe(handleChange)