/**
 * Created by peter on 2/8/17.
 */
//import Login from './index';
import React from 'react';
import { connect } from 'react-redux';
import { registerRoute } from '../../actions/async_routes';

const SyncComponent = ({routeIdentifier,retrieveComponent,markAsSSR}) => {
    console.log('Loading route synchronously');
    markAsSSR(routeIdentifier);
    let Component = retrieveComponent();
    return <Component />;
};

SyncComponent.propTypes = {
    routeIdentifier: React.PropTypes.string.isRequired,
    retrieveComponent: React.PropTypes.func.isRequired,
};

//const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    markAsSSR: (route) => dispatch(registerRoute(route))
});

export default connect(() => {return{}},mapDispatchToProps)(SyncComponent);