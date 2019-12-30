import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./AuthForm";
import {initState, StateProvider} from "../contexts/StateContext";
import {Home} from "./Home";
import {AuthRoute} from "./commons/AuthRoute";
import {PageNotFound} from "./commons/PageNotFound";
import {mainReducer} from "../reducers";

const App = () => {
    return (
        <StateProvider initialState={initState} reducer={mainReducer}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/login' component={AuthForm}/>
                    <AuthRoute exact path='/' component={Home}/>
                    <Route path='*' component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        </StateProvider>
    );
};

export default App;
