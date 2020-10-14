import React, {useState} from 'react';
import "./styles.scss"
import classnames from 'classnames';
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {AppState} from "../../modules/rootReducer";
import {LogIn} from "./LogIn";
import {SignUp} from "./SignUp";

export const AuthForm = () => {
    const isLoggedIn = useSelector((state: AppState) => state.auth.isAuthenticated)
    const [isLoginSelected, setLoginSelected] = useState<boolean>(false);

    if (isLoggedIn)
        return (<Redirect to={{pathname: '/'}}/>);

    const Content = isLoginSelected ? <LogIn/> : <SignUp/>;
    return (
        <div className='auth-form'>
            <div id="background"/>
            <div className='buttons-container'>
                <button className={classnames({'selected': !isLoginSelected})} onClick={() => setLoginSelected(false)}>
                    Sign up
                </button>
                <button className={classnames({'selected': isLoginSelected})} onClick={() => setLoginSelected(true)}>
                    Log In
                </button>
            </div>
            {Content}
        </div>
    );
};