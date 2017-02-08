/**
 * Created by peter on 2/7/17.
 */
import React from 'react';
import SyncComponent from '../sync_component';

export default () => (
    <SyncComponent
        routeIdentifier="login"
        retrieveComponent={() => require('./index').default} />
);