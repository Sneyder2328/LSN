import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "../../commons/ErrorMessage";
import {connect} from "react-redux";
import {LoginCredentials, logInUser} from "../authActions";
import {FormError} from "../authReducer";
import {AppState} from "../../../reducers";
import {IntrinsicElements} from "../icon";

type Props = {
    logInError?: FormError,
    logInUser: (credentials: LoginCredentials) => any
};

const LogIn: React.FC<Props> = ({logInError, logInUser}) => {
    const {register, handleSubmit, errors, setError} = useForm();

    useEffect(() => {
        if (logInError) setError(logInError.fieldName, logInError.fieldName, logInError.message);
    }, [logInError]);

    // @ts-ignore
    const onSubmit = (data: any) => logInUser(data);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>Welcome Back!</p>
			<i class="fas fa-user inputIcon" id="iconUser"></i>
            <div className="inputFrame">
                <input name="username" type="text" placeholder='Username' className="input_style1 loginInput"
                       ref={register({required: {value: true, message: 'Please enter your username'}})}/>
                <ErrorMessage message={errors.username}/>
            </div>
            <div className="inputFrame">
				<i class="fas fa-lock inputIcon" id="iconPass"></i>
                <input name="password" type="password" placeholder='Password' className="input_style1 loginInput"
                       ref={register({required: {value: true, message: 'Please enter your password'}})}/>
                <ErrorMessage message={errors.password}/>
            </div>
            <button>Log in</button>
        </form>
    );
};

const mapStateToProps = (state: AppState) => ({
    logInError: state.auth.logInError
});

export default connect(mapStateToProps, {logInUser})(LogIn);
