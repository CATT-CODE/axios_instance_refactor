import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkIsUserLoggedIn } from "../lib/helpers";

const PrivateRoute = ({component: Component, handleUserLogout, ...rest}) => {
    return (
        <Route 
        {...rest}
        render={(routerProps) => 
            checkIsUserLoggedIn() ? <Component {...routerProps} handleUserLogout={handleUserLogout} /> : <Redirect to="/login" />
        }
        />
    );
}

export default PrivateRoute;
