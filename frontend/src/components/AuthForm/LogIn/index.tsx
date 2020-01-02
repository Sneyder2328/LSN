import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "../../commons/ErrorMessage";
import {connect} from "react-redux";
import {LoginCredentials, logInUser} from "../../../actions/authActions";
import {FormError} from "../../../reducers/authReducer";

type Props = {
    logInError: FormError,
    logInUser: (credentials: LoginCredentials) => any
};

const LogIn: React.FC<Props> = ({logInError, logInUser}) => {
    const {register, handleSubmit, errors, setError} = useForm();

    //const {state: {auth}, dispatch} = useStateValue();

    useEffect(() => {
        if (logInError) setError(logInError.fieldName, logInError.fieldName, logInError.message);
    }, [logInError]);

    // @ts-ignore
    const onSubmit = async (data: any) => logInUser(data);
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
};

const mapStateToProps = (state: any) => ({
    logInError: state.auth.logInError
});

export default connect(mapStateToProps, {logInUser})(LogIn);
