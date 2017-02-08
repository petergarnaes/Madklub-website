/**
 * Created by peter on 2/8/17.
 */
import React from 'react';
import { connect } from 'react-redux';
import { resolved_components } from '../../async/resolved_components';

class AsyncComponent extends React.Component {
    static propTypes = {
        routeIdentifier: React.PropTypes.string.isRequired,
        retrieveComponent: React.PropTypes.func.isRequired,
    };
    static Component = null;
    mounted = false;

    state = {
        Component: AsyncComponent.Component
    };

    componentWillMount() {
        // Checks if route was registered, ie. SSR loaded.
        if(!this.props.routeRegistered){
            if ( this.state.Component === null ) {
                new Promise((resolve) => this.props.retrieveComponent(resolve)).then(m => m.default).then(Component => {
                    AsyncComponent.Component = Component;
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
            AsyncComponent.Component = resolved_components[this.props.routeIdentifier];
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
            Component = AsyncComponent.Component;
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

const mapStateToProps = (state, ownProps) => ({
    routeRegistered: state.registeredRoutes[ownProps.routeIdentifier]
});

export default connect(mapStateToProps)(AsyncComponent);