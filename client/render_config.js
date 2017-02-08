/**
 * Created by peter on 2/4/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React       from 'react';
import { BrowserRouter }  from 'react-router-dom';
import * as Cookies from "js-cookie";
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import App from '../app/components';
import * as reducers from '../app/reducers';
import async_map from '../app/async/components';
import {set_resolved_component} from '../app/async/resolved_components';

let initialState = window.__PRELOADED_STATE__;

const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
        credentials: 'same-origin'
    }
});

// TODO yet to be tested
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {};  // Create the header object if needed.
        }

        // get the authentication token from local storage if it exists
        const token = Cookies.get("csrf_token");
        console.log('token is '+token);
        req.options.headers['X-CSRF-TOKEN'] = token ? token : null;
        next();
    }
}]);

const client = new ApolloClient({
    networkInterface
});

const store = createStore(
    combineReducers({
        ...reducers,
        apollo: client.reducer()
    }),
    initialState, // initial state
    compose(
        applyMiddleware(client.middleware()),
        // If you are using the devToolsExtension, you can add it here also
        //window.devToolsExtension ? window.devToolsExtension() : f => f,
    )
);

function asyncFunction (route, cb) {
    new Promise((resolve) => async_map[route](resolve)).then((c)=>{
        console.log('We now have loaded '+route);
        console.log(c);
        set_resolved_component(route,c.default);
        cb();
    });
}

export let requests = Object.keys(initialState.registeredRoutes).map((item) => {
    return new Promise((resolve) => {
        asyncFunction(item, resolve);
    });
});

export default () => (
    <ApolloProvider store={store} client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>
);