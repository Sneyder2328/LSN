import React from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import ErrorMessage from "../Shared/ErrorMessage";

function LogIn() {
    const {register, handleSubmit, errors, setError} = useForm();
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post('/sessions/', {
                username: data.username,
                password: data.password
            });
            console.log("response=", response);
            if (response.status === 200 && response.data.access === true) {
                console.log("Logged in successfully!");
            }
        } catch (err) {
            console.log("error:", err.response.data);
            setError(err.response.data.error, err.response.data.error, err.response.data.message);
        }
    };
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
