/**
 * Created by peter on 2/10/17.
 */
import React from 'react';
import SyncComponent from '../sync_component';

export default () => (
    <SyncComponent
        routeIdentifier="calendar"
        retrieveComponent={() => require('./index').default} />
);