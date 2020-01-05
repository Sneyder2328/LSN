import React from "react";
import {Redirect, Route} from "react-router-dom";
import {connect} from "react-redux";
import {AppState} from "../../reducers";

// @ts-ignore
const AuthRoute = ({isLoggedIn, component: Component, ...rest}) => {
    return <Route {...rest} render={(props: any) => (
        isLoggedIn ? <Component {...props}/>
            : <Redirect to={
                {
                    pathname: '/login',
                    state: {from: props.location}
                }
            }/>
    )}
    />
};

const mapStateToProps = (state: AppState) => ({
    isLoggedIn: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(AuthRoute);