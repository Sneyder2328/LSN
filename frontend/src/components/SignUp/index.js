import React, {useState} from "react";
import axios from 'axios';
import classnames from 'classnames';
import {useForm} from 'react-hook-form'
import ErrorMessage from "../Shared/ErrorMessage";

const splitInTwo = {
    width: '48%'
};


function SignUp() {
    const {register, handleSubmit, errors, setError} = useForm();
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post('/users/', {
                username: data.username,
                fullname: data.fullname,
                password: data.password,
                typeLogin: 'email',
                email: data.email,
                description: '',
                profilePhotoUrl: '',
                coverPhotoUrl: ''
            });
            console.log("response=", response);
            if (response.status === 200 && response.data.access === true) {
                console.log("Signed up successfully!");
            }
        } catch (err) {
            console.log("error:", err.response.data);
            setError(err.response.data.error, err.response.data.error, err.response.data.message);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>Sign up to LaSocialNetwork</p>
            <div style={{...splitInTwo, float: 'left'}}>
                <input name="fullname" type="text" placeholder='Full name'
                       className={classnames({'invalid-input': errors.fullname})} ref={register({
                    required: {value: true, message: 'Please enter your full name'},
                    minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.fullname}/>
            </div>
            <div style={{...splitInTwo, float: 'right'}}>
                <input name="username" type="text" placeholder='Username'
                       className={classnames({'invalid-input': errors.username})} ref={register({
                    required: {value: true, message: 'Please enter a username'},
                    pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
                    minLength: {value: 5, message: 'Username must be at least 5 characters long'}
                })}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div>
                <input name="email" placeholder='Email' className={classnames({'invalid-input': errors.email})}
                       ref={register({
                           required: {value: true, message: 'Please enter your email address'},
                           pattern: {
                               value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                               message: 'Please provide a properly formatted email address'
                           }
                       })}/>
                <ErrorMessage message={errors.email}/>
            </div>
            <div>
                <input name="password" type="password" placeholder='Password'
                       className={classnames({'invalid-input': errors.password})} ref={register({
                    required: {value: true, message: 'Please enter your password'},
                    minLength: {value: 8, message: 'Your password needs to be at least 8 characters long'}
                })}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button>Create account</button>
        </form>
    );
}

export default SignUp;