/**
 * Created by peter on 2/7/17.
 */
//import Login from './index';
import React from 'react';
import { connect } from 'react-redux';
import { resolved_components } from '../../async/resolved_components';

class AsyncLogin extends React.Component {
    static Component = null;
    mounted = false;

    state = {
        Component: AsyncLogin.Component
    };

    componentWillMount() {
        // Checks if route was registered, ie. SSR loaded.
        if(!this.props.routeRegistered){
            if ( this.state.Component === null ) {
                new Promise((resolve) => require.ensure([],() => resolve(require('./index')),'login')).then(m => m.default).then(Component => {
                    AsyncLogin.Component = Component;
                    console.log('Loading async, routeRegistered was: '+this.props.routeRegistered);
                    if ( this.mounted ) {
                        console.log('We render async route');
                        this.setState({Component});
                    }
                })
            }
        } else {
            // If route WAS registered, we know it has been resolved before rendering, so we can get it from resolved
            // components
            console.log('route was registered, should see an identical render');
            AsyncLogin.Component = resolved_components['login'];
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        var Component = null;
        if(this.props.routeRegistered){
            console.log('Just to be sure, routeRegistered was: '+this.props.routeRegistered);
            // Route rendered on server
            Component = AsyncLogin.Component;
        } else {
            // Route is pulled asynchronously
            console.log('Async route detected');
            Component = this.state.Component;
        }

        if ( Component !== null ) {
            console.log('route rendered');
            return <Component {...this.props} />
        }
        console.log('Are we getting here?');
        return null; // or <div /> with a loading spinner, etc..
    }
}

//const AsyncLogin = ({routeRegistered}) => {
//};

const mapStateToProps = (state) => ({
    routeRegistered: state.registeredRoutes['login']
});

export default connect(mapStateToProps)(AsyncLogin);