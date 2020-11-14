import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {persistor, store} from "../store";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";
import {PersistGate} from "redux-persist/integration/react";
import {PageNotFound} from "../components/shared/PageNotFound";
import {AuthRoute} from "../components/shared/AuthRoute";
import {ModalContainer} from "../components/Modals/ModalContainer";
import {AuthForm} from "./Auth";
import {NewsFeedPage} from "./NewsFeed/NewsFeed";
import {UserProfilePage} from "./UserProfile/UserProfile";

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
                <ModalContainer/>
            </PersistGate>
        </Provider>
    );
};

let currentAccessToken: string | undefined

const handleChange = () => {
    const previousAccessToken = currentAccessToken
    currentAccessToken = store.getState().auth.accessToken
    if (previousAccessToken !== currentAccessToken) {
        console.log('accessToken changed from', previousAccessToken, 'to', currentAccessToken)
        if (currentAccessToken) {
            setAccessTokenHeaders(currentAccessToken);
        } else if (previousAccessToken) {
            removeAuthTokenHeaders()
        }
    }
};

store.subscribe(handleChange)
// store.s