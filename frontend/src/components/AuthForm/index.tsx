import React, {useEffect, useState} from 'react';
import "./styles.scss"
import classnames from 'classnames';
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import {useStateValue} from "../../contexts/StateContext";
import {useHistory} from "react-router";

function AuthForm() {
    // @ts-ignore
    const {state: {auth}} = useStateValue();

    const history = useHistory();
    useEffect(() => {
        if (auth.isLoggedIn) history.push('/');
    }, [auth]);

    const [isLoginSelected, setLoginSelected] = useState<boolean>(false);
    const Content = isLoginSelected ? <LogIn/> : <SignUp/>;
    return (
        <div className='auth-form'>
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
}

export default AuthForm;
