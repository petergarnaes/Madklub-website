/**
 * Created by peter on 2/4/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import * as Cookies from "js-cookie";
//import ApolloClient, { createNetworkInterface,toIdValue } from 'apollo-client';
import { ApolloClient } from "apollo-client";
import { toIdValue } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, concat } from "apollo-link";
import App from "../app/components";
import * as reducers from "../app/reducers";
import async_map from "../app/async/components";
import { set_resolved_component } from "../app/async/resolved_components";
import RegisterComponentContainer from "../app/async/component_register_container";
import moment from "moment";
import dataIdFromObject from "../app/util/data_id_from_object";

// Setting locale for entire app
moment.locale("da");

let initialState = window.__PRELOADED_STATE__;
let apolloInitialState = window.__APOLLO_STATE__;
let registeredComponents = window.__REGISTERED_COMPONENTS__;

const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin"
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = Cookies.get("csrf_token");
  console.log("token is " + token);
  const csrf = token ? token : null;
  operation.setContext({
    headers: {
      //authorization: localStorage.getItem("token") || null
      "X-CSRF-TOKEN": csrf
    }
  });
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: dataIdFromObject,
    addTypename: true,
    cacheResolvers: {
      // Specify __typename on which the customResolver of a field goes,
      // if top-level field the typename is Query, like in the examples
      Kitchen: {
        dinnerclub: (_, args) => {
          return toIdValue(
            dataIdFromObject({ __typename: "DinnerClub", id: args["id"] })
          );
        }
      }
    }
  }).restore(apolloInitialState),
  link: concat(authMiddleware, httpLink)
});

console.log("Initial apollo");
console.log(apolloInitialState);

/*const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
    applyMiddleware(client.middleware())
    // other store enhancers if any
);*/

const store = createStore(
  combineReducers({
    ...reducers
    //apollo: client.reducer()
  }),
  initialState // initial state
  //enhancer
);

function asyncFunction(route, cb) {
  new Promise(resolve => async_map[route](resolve)).then(c => {
    console.log("We now have loaded " + route);
    console.log(c);
    set_resolved_component(route, c.default);
    cb();
  });
}

export let requests = registeredComponents.map(item => {
  return new Promise(resolve => {
    asyncFunction(item, resolve);
  });
});

export default () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <RegisterComponentContainer registeredComponents={registeredComponents}>
          <App />
        </RegisterComponentContainer>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
);
