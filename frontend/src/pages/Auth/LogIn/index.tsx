import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {logInUser} from "../../../modules/Auth/authActions";
import {ErrorMessage} from "../../../components/shared/ErrorMessage";
import {AppState} from "../../../modules/rootReducer";

export const LogIn = () => {
    const dispatch = useDispatch()
    const logInError = useSelector((state: AppState) => state.auth.logInError)
    const {register, handleSubmit, errors, setError} = useForm();

    useEffect(() => {
        if (logInError) setError(logInError.fieldName, logInError.fieldName, logInError.message);
    }, [logInError]);

    // @ts-ignore
    const onSubmit = (data: any) => {
        dispatch(logInUser(data));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p className="title">Welcome Back!</p>
            <div className="inputFrame">
                <i className="fas fa-user inputIcon" id="iconUser"/>
                <input name="username" type="text" placeholder='Username' className="input_style1 loginInput"
                       ref={register({required: {value: true, message: 'Please enter your username'}})}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div className="inputFrame">
                <i className="fas fa-lock inputIcon" id="iconPass"/>
                <input name="password" type="password" placeholder='Password' className="input_style1 loginInput"
                       ref={register({required: {value: true, message: 'Please enter your password'}})}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button>Log in</button>
        </form>
    );
};
