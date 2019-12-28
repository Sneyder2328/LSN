import React from "react";
import {Redirect, Route} from "react-router-dom";
import {useStateValue} from "../../contexts/StateContext";

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const [{isLoggedIn}] = useStateValue();
    return <Route {...rest} render={(props) => (
        isLoggedIn === true ? <Component {...props}/>
            : <Redirect to={
                {
                    pathname: '/login',
                    state: {from: props.location}
                }
            }/>
    )}
    />
};