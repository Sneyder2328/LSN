import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from "../store";
import { removeAuthTokenHeaders, setAccessTokenHeaders } from "../utils/setAccessTokenHeaders";
import { PersistGate } from "redux-persist/integration/react";
import { AuthRoute } from "../components/shared/AuthRoute";
import { ModalContainer } from "../components/Modals/ModalContainer";
import { AuthForm } from "./Auth";
import { NewsFeedPage } from "./NewsFeed/NewsFeed";
import { UserProfilePage } from "./UserProfilePage/UserProfilePage";
import { PostPage } from "./PostPage/PostPage";
import { PhotoDetailPage } from "./PhotoDetailPage/PhotoDetailPage";
import { TrendsPage } from './TrendsPage/TrendsPage';
import { NotFoundPage } from './NotFoundPage/PageNotFound';

export const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/login' component={AuthForm} />
                        <AuthRoute exact path='/' component={NewsFeedPage} />
                        <AuthRoute path='/posts/:postId' component={PostPage} />
                        <AuthRoute path='/photos/:photoId' component={PhotoDetailPage} />
                        <AuthRoute path='/users/:userIdentifier' component={UserProfilePage} />
                        <AuthRoute path='/trends/:trend' component={TrendsPage} />
                        <Route path='*' component={NotFoundPage} />
                    </Switch>
                    <ModalContainer />
                </BrowserRouter>
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