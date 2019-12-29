import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./AuthForm";
import {StateProvider} from "../contexts/StateContext";
import {Home} from "./Home";
import {AuthRoute} from "./commons/AuthRoute";
import {initialState, authReducer} from "../reducers/authReducer";
import {PageNotFound} from "./commons/PageNotFound";

function App() {
    return (
        <StateProvider initialState={initialState} reducer={authReducer}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/login' component={AuthForm}/>
                    <AuthRoute exact path='/' component={Home}/>
                    <Route path='*' component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        </StateProvider>
    );
}

export default App;
