import React, {useEffect} from "react";
import classnames from 'classnames';
import {useForm} from 'react-hook-form'
import {ErrorMessage} from "../../commons/ErrorMessage";
import {connect} from "react-redux";
import {FormError} from "../authReducer";
import {SignUpCredentials, signUpUser} from "../authActions";
import {AppState} from "../../../reducers";

type Props = {
    signUpError?: FormError,
    signUpUser: (credentials: SignUpCredentials) => any
};

const SignUp: React.FC<Props> = ({signUpError, signUpUser}) => {
    const {register, handleSubmit, errors, setError} = useForm();

    useEffect(() => {
        if (signUpError) setError(signUpError.fieldName, signUpError.fieldName, signUpError.message);
    }, [signUpError]);

    // @ts-ignore
    const onSubmit = (data: any) => signUpUser(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} id="signUpForm">
            <p className="title">Sign up to LaSocialNetwork</p>
            <div style={{width: '48%', float: 'left'}} className="inputFrame">
                <input name="fullname" type="text" placeholder='Full name'
                       className={classnames({'invalid-input': errors.fullname},'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter your full name'},
                    minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.fullname}/>
            </div>
            <div style={{width: '48%', float: 'right'}} className="inputFrame">
                <input name="username" type="text" placeholder='Username'
                       className={classnames({'invalid-input': errors.username},'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter a username'},
                    pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
                    minLength: {value: 5, message: 'Username must be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div className="inputFrame" style={{clear: 'both'}}>
                <input name="email" placeholder='Email' className={classnames({'invalid-input': errors.email},'input_style1')}
                       ref={register({
                           required: {value: true, message: 'Please enter your email address'},
                           pattern: {
                               value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                               message: 'Please provide a properly formatted email address'
                           }
                       })}/>
                <ErrorMessage message={errors.email}/>
            </div>
            <div className="inputFrame">
                <input name="password" type="password" placeholder='Password' 
                       className={classnames({'invalid-input': errors.password},'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter your password'},
                    minLength: {value: 8, message: 'Your password needs to be at least 8 characters long'}
                })}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button id="createAccount">Create account</button>
        </form>
    );
};

const mapStateToProps = (state: AppState) => ({
    signUpError: state.auth.signUpError
});

export default connect(mapStateToProps, {signUpUser})(SignUp);