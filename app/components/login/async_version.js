/**
 * Created by peter on 2/7/17.
 */
//import Login from './index';
import React from 'react';
import AsyncComponent from '../async_component';
import async_routes from '../../async/components';

export default () => (
    <AsyncComponent
        routeIdentifier="login"
        retrieveComponent={async_routes['login']} />
);