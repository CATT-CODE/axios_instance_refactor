import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './component/Home';
import Login from './component/Login/Login';
import SignUp from './component/SignUp/SignUp';
import AuthMovieHome from './component/AuthMovieHome/AuthMovieHome'
import NavBar from './component/NavBar/NavBar';
import NotFound from "./component/NotFound/NotFound";
import PrivateRoute from './component/PrivateRoute/PrivateRoute';
import MovieDetail from './component/AuthMovieHome/MovieDetail';
import Profile from './component/Profile/Profile';
import CreateFriend from './component/CreateFriend/CreateFriend';

const MainRouter = (props) => {
    //console.log(props);
    return (
        <Router user={props.user}>
            {/* <Route path="/" component={Home} />
            <Route path="/" component={SignUp} /> */}
            <NavBar user={props.user} handleUserLogout={props.handleUserLogout} />
            <Switch>
                {/* <Route exact path="/movie-home" component={AuthMovieHome} /> */}
                <PrivateRoute exact path="/movie-home" user={props.user} component={AuthMovieHome} />
                <PrivateRoute exact path="/movie-detail/:title" component={MovieDetail} />
                <PrivateRoute exact path="/profile" component={Profile} handleUserLogout={props.handleUserLogout} />
                <PrivateRoute exact path="/create-friend" component={CreateFriend} />
                <Route exact path="/sign-up" component={SignUp} />
                <Route exact path="/login" render={(routerProps) => <Login {...routerProps} handleUserLogin={props.handleUserLogin} />} />
                <Route exact path="/" component={Home} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}

export default MainRouter
