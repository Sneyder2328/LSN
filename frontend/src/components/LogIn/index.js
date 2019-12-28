import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import ErrorMessage from "../commons/ErrorMessage";
import {useStateValue} from "../../contexts/StateContext";
import {logInUser} from "../../actions/authActions";

function LogIn() {
    const {register, handleSubmit, errors, setError} = useForm();
    const [{logInError}, dispatch] = useStateValue();

    useEffect(() => {
        if (logInError) setError(logInError.fieldName, logInError.fieldName, logInError.message);
    }, [logInError]);


    const onSubmit = async (data) => dispatch(await logInUser(data));
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
