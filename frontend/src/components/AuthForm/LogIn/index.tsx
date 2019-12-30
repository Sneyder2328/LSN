import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "../../commons/ErrorMessage";
import {useStateValue} from "../../../contexts/StateContext";
import {logInUser} from "../../../actions/authActions";

function LogIn() {
    const {register, handleSubmit, errors, setError} = useForm();

    const {state: {auth}, dispatch} = useStateValue();

    useEffect(() => {
        if (auth.logInError) setError(auth.logInError.fieldName, auth.logInError.fieldName, auth.logInError.message);
    }, [auth.logInError]);

    // @ts-ignore
    const onSubmit = async (data: any) => dispatch(await logInUser(data));
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>Welcome Back!</p>
            <div>
                <input name="username" type="text" placeholder='Username'
                       ref={register({required: {value: true, message: 'Please enter your username'}})}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div>
                <input name="password" type="password" placeholder='Password'
                       ref={register({required: {value: true, message: 'Please enter your password'}})}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button>Log in</button>
        </form>
    );
}

export default LogIn;
