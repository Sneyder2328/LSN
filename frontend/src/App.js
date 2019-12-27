import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import AuthForm from "./components/AuthForm/index";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Route exact path='/' component={AuthForm}/>
            </div>
        </BrowserRouter>
    );
}

export default App;
