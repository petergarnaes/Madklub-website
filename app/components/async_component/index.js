/**
 * Created by peter on 2/8/17.
 */
import React from 'react';
import LoadingIcon from '../loading_icon';
import { withComponentRegister } from '../../async/component_register_container';
import { resolved_components } from '../../async/resolved_components.js';

class AsyncComponent extends React.Component {
    // Called on initial mount and every time this
    // component is rendered with new props.
    constructor(props){
        super(props);
        this.fetchRouteComponent = this.fetchRouteComponent.bind(this);
        // Must reset, so route fetching succeeds
        AsyncComponent.Component = null;
        this.state = {
            Component: AsyncComponent.Component
        };
        // Must fetch the bundle
        this.fetchRouteComponent();
    }

    static propTypes = {
        routeIdentifier: React.PropTypes.string.isRequired,
        retrieveComponent: React.PropTypes.func.isRequired,
    };
    static Component = null;
    mounted = false;

    fetchRouteComponent(){
        // Checks if route was registered, ie. SSR loaded.
        if(!this.props.isRegistered(this.props.routeIdentifier)){
            if ( AsyncComponent.Component === null ) {
                new Promise((resolve) => this.props.retrieveComponent(resolve)).then(m => m.default).then(Component => {
                    AsyncComponent.Component = Component;
                    console.log('Loading async, routeRegistered was: '+this.props.isRegistered(this.props.routeIdentifier));
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

    // TODO: Probably removeable
    componentWillReceiveProps(newProps) {
        // This happens when we move between async components, in which case we
        // must ensure we are requesting the bundle (cached or not).
        // Apparently this is not called if we have a constructor...
        if(!(newProps.routeIdentifier === this.props.routeIdentifier)){
            console.log('Rendering new async route?');
            AsyncComponent.Component = null;
            this.fetchRouteComponent();
        }
    }

    // Make sure to fetch on initial mount
    componentWillMount() {
        this.fetchRouteComponent();
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        var Component = null;
        if(this.props.isRegistered(this.props.routeIdentifier)){
            console.log('Just to be sure, routeRegistered was: '+this.props.isRegistered(this.props.routeIdentifier));
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
        return <LoadingIcon message="Loading page..."/>; // or <div /> with a loading spinner, etc..
    }
}

/*const mapStateToProps = (state, ownProps) => ({
    routeRegistered: state.registeredRoutes[ownProps.routeIdentifier]
});*/

export default withComponentRegister(AsyncComponent);