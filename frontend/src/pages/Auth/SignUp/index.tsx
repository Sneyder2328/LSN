import React, {useEffect} from "react";
import classnames from 'classnames';
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../modules/rootReducer";
import {signUpUser} from "../../../modules/Auth/authActions";
import {ErrorMessage} from "../../../components/shared/ErrorMessage";


export const SignUp = () => {
    const dispatch = useDispatch()
    const signUpError = useSelector((state: AppState) => state.auth.signUpError)
    const {register, handleSubmit, errors, setError} = useForm();

    useEffect(() => {
        if (signUpError) setError(signUpError.fieldName, signUpError.fieldName, signUpError.message);
    }, [signUpError]);

    // @ts-ignore
    const onSubmit = (data: any) => {
        dispatch(signUpUser(data));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} id="signUpForm">
            <p className="title">Sign up to LaSocialNetwork</p>
            <div style={{width: '48%', float: 'left'}} className="inputFrame">
                <input name="fullname" type="text" placeholder='Full name'
                       className={classnames({'invalid-input': errors.fullname}, 'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter your full name'},
                    minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.fullname}/>
            </div>
            <div style={{width: '48%', float: 'right'}} className="inputFrame">
                <input name="username" type="text" placeholder='Username'
                       className={classnames({'invalid-input': errors.username}, 'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter a username'},
                    pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
                    minLength: {value: 5, message: 'Username must be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div className="inputFrame" style={{clear: 'both'}}>
                <input name="email" placeholder='Email'
                       className={classnames({'invalid-input': errors.email}, 'input_style1')}
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
                       className={classnames({'invalid-input': errors.password}, 'input_style1')} ref={register({
                    required: {value: true, message: 'Please enter your password'},
                    minLength: {value: 8, message: 'Your password needs to be at least 8 characters long'}
                })}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button id="createAccount">Create account</button>
        </form>
    );
};