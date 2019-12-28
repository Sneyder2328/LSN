import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthForm from "./components/AuthForm/index";
import {StateProvider} from "./contexts/StateContext";
import {Home} from "./components/Home/index";
import {ProtectedRoute} from "./components/commons/ProtectedRoute";
import {initialState, authReducer} from "./reducers/authReducer";

function App() {
    return (
        <StateProvider initialState={initialState} reducer={authReducer}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/login' component={AuthForm}/>
                    <ProtectedRoute exact path='/' component={Home}/>
                    <Route path='*' component={() => "404 Not found"}/>
                </Switch>
            </BrowserRouter>
        </StateProvider>
    );
}

export default App;
