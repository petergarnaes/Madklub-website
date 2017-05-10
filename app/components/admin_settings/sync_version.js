/**
 * Created by peter on 5/5/17.
 */
import React from 'react';
import SyncComponent from '../sync_component';

export default () => (
    <SyncComponent
        routeIdentifier="admin_settings"
        retrieveComponent={() => require('./index').default} />
);


