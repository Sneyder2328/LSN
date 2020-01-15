import React, {useState} from 'react';
import "./styles.scss"
import classnames from 'classnames';
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {AppState} from "../../reducers";

type Props = {
    isLoggedIn: boolean;
}

const AuthForm: React.FC<Props> = ({isLoggedIn}) => {
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

const mapStateToProps = (state: AppState) => ({
    isLoggedIn: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(AuthForm);