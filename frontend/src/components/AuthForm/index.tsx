import React, {useEffect, useState} from 'react';
import "./styles.scss"
import classnames from 'classnames';
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import {useHistory} from "react-router";
import {connect} from "react-redux";

type Props = {
    isLoggedIn: boolean;
}

const AuthForm: React.FC<Props> = ({isLoggedIn}) => {
    const history = useHistory();
    if (isLoggedIn) history.push('/');

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
};

const mapStateToProps = (state: any) => ({
    isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(AuthForm);
