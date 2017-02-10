/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import AsyncComponent from '../async_component';
import async_routes from '../../async/components';

export default () => (
    <AsyncComponent
        routeIdentifier="calendar"
        retrieveComponent={async_routes['calendar']} />
);