/**
 * Created by peter on 2/8/17.
 */
import React from 'react';
import { withComponentRegister } from '../../async/component_register_container';

const SyncComponent = ({routeIdentifier,retrieveComponent,registerComponent}) => {
    console.log('Loading route synchronously');
    /*if(process.env.EXECUTION_ENV === 'server'){
     registerComponent(routeIdentifier);
    }*/
    registerComponent(routeIdentifier);
    let Component = retrieveComponent();
    return <Component />;
};

SyncComponent.propTypes = {
    routeIdentifier: React.PropTypes.string.isRequired,
    retrieveComponent: React.PropTypes.func.isRequired,
};

export default withComponentRegister(SyncComponent);