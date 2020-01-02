import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./AuthForm";
import { Provider } from 'react-redux';
import {Home} from "./Home";
import AuthRoute from "./commons/AuthRoute";
import {PageNotFound} from "./commons/PageNotFound";
import store from "../store";

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
