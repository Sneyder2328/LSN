import React, {useState} from 'react';
import "./styles.scss"
import SignUp from "../SignUp";
import LogIn from "../LogIn";

function AuthForm() {
    const [isLoginSelected, setLoginSelected] = useState(false);
    const Content = isLoginSelected ? <LogIn/> : <SignUp/>;
    return (
        <div className='auth-form'>
            <div className='buttons-container'>
                <button className={!isLoginSelected ? 'selected' : undefined}
                        onClick={() => setLoginSelected(false)}>Sign up
                </button>
                <button className={isLoginSelected ? 'selected' : undefined} onClick={() => setLoginSelected(true)}>Log
                    In
                </button>
            </div>
            {Content}
        </div>
    );
}

export default AuthForm;
