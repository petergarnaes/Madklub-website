//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React       from 'react';
import { render }  from 'react-dom';
import { BrowserRouter }  from 'react-router-dom';
import * as Cookies from "js-cookie";
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import App from '../app/components';
import * as reducers from '../app/reducers';

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
    window.__PRELOADED_STATE__, // initial state
    compose(
        applyMiddleware(client.middleware()),
        // If you are using the devToolsExtension, you can add it here also
        //window.devToolsExtension ? window.devToolsExtension() : f => f,
    )
);

render(
    <ApolloProvider store={store} client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('react-view')
);