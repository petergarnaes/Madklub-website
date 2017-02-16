/**
 * Created by peter on 2/4/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React       from 'react';
import { BrowserRouter }  from 'react-router-dom';
import * as Cookies from "js-cookie";
import ApolloClient, { createNetworkInterface,toIdValue } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import App from '../app/components';
import * as reducers from '../app/reducers';
import async_map from '../app/async/components';
import {set_resolved_component} from '../app/async/resolved_components';
import RegisterComponentContainer from '../app/async/component_register_container';
import moment from 'moment';
import dataIdFromObject from '../app/util/data_id_from_object';

// Setting locale for entire app
moment.locale("da");

let initialState = window.__PRELOADED_STATE__;
let registeredComponents = window.__REGISTERED_COMPONENTS__;

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
    dataIdFromObject: dataIdFromObject,
    addTypename: true,
    customResolvers: {
        // Specify __typename on which the customResolver of a field goes,
        // if top-level field the typename is Query, like in the examples
        Kitchen: {
            dinnerclub: (_, args) => {
                return toIdValue(dataIdFromObject({ __typename: 'DinnerClub', id: args['id'] }))
            },
        },
    },
    networkInterface
});

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(client.middleware()),
    // other store enhancers if any
);

const store = createStore(
    combineReducers({
        ...reducers,
        apollo: client.reducer()
    }),
    initialState, // initial state
    enhancer
);

function asyncFunction (route, cb) {
    new Promise((resolve) => async_map[route](resolve)).then((c)=>{
        console.log('We now have loaded '+route);
        console.log(c);
        set_resolved_component(route,c.default);
        cb();
    });
}

export let requests = registeredComponents.map((item) => {
    return new Promise((resolve) => {
        asyncFunction(item, resolve);
    });
});

export default () => (
    <ApolloProvider store={store} client={client}>
        <BrowserRouter>
            <RegisterComponentContainer registeredComponents={registeredComponents}>
                <App />
            </RegisterComponentContainer>
        </BrowserRouter>
    </ApolloProvider>
);