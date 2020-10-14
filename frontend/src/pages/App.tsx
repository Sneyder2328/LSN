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
                <ModalContainer />
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