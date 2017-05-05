/**
 * Created by peter on 5/5/17.
 */
import React from 'react';
import AsyncComponent from '../async_component';
import async_routes from '../../async/components';

export default () => (
    <AsyncComponent
        routeIdentifier="user_settings"
        retrieveComponent={async_routes['user_settings']} />
);

