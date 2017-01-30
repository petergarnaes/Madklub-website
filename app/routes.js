import React from 'react';
import { Route,IndexRoute } from 'react-router';
import App from './components';
import Main from './components/main';
import Login from './components/login';
import Logout from './components/logout';

export default (
    <Route component={App} path="/" >
        <IndexRoute component={Main}/>
        <Route component={Login} path="/login" />
        <Route component={Logout} path="/logout" />
    </Route>
);
