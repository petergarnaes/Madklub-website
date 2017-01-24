//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React       from 'react';
import { render }  from 'react-dom';
import { browserHistory, Router }  from 'react-router';
import * as Cookies from "js-cookie";
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
//import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './../app/routes';

//const history = createBrowserHistory();

const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
        credentials: 'same-origin',
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
    initialState: window.__PRELOADED_STATE__,
    networkInterface
});

render(
    <ApolloProvider client={client}>
        <Router children={routes} history={browserHistory} />
    </ApolloProvider>,
    document.getElementById('react-view')
);
