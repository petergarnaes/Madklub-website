import "babel-polyfill";
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var fs = require('fs');

import React from 'react';
// Server functionality related imports
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import schema from './api/schema';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ApolloClient from 'apollo-client';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import {createLocalInterface}  from 'apollo-local-query';
import { port, auth, analytics } from './config';
const graphql = require('graphql');
import db from './api/db/index';
import * as reducers from '../app/reducers';
import registerLoginMiddleware from './login/login_middleware';
import testSet from './api/db/test_set';
// Imports for server rendering
import { renderToString } from 'react-dom/server';
//import { StaticRouter } from 'react-router';
import { StaticRouter } from 'react-router-dom';
//import routes from '../app/routes';
import App from '../app/components';

const crypto = require('crypto');
const app = express();

// Setup hot loading and dev stuff
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    getToken: req => req.cookies.id_token,
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
}));

/* by generating a random csrf token for each request with privileges.
 * Implement 'Cookie-to-Header Token' also called 'Double Submit'. We can see how Apollo does this in
 * client/index.js.
 * If the hacker tricks a user into submitting some request, he would have to guess the csrf token,
 * which would be impossible because new one is generated with each request.*/
// Generates a random sequence, which we use as CSRF token
app.use((req,res,next)=>{
    //console.log("Sup: "+req.cookies.csrf_token);
    var id = crypto.randomBytes(20).toString('hex');
    res.cookie('csrf_token', id, {httpOnly: false});
    next();
});

registerLoginMiddleware(app);

app.use('/logout',(req,res)=>{
    console.log('Logging you out...');
    res.cookie('id_token', '', {maxAge: new Date(0),expires: Date.now(), httpOnly: true});
    res.redirect('/');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql',expressGraphQL((req,res) => ({
        schema,
        graphiql: true,
        rootValue: { request: req, response: res },
        pretty: process.env.NODE_ENV !== 'production',
    })
));

/**
 * Handles rendering by creating initial state and responding with the rendered
 * app based on that state.
 **/
async function handleRender(req,res){
    // Sets up network interface to load data locally not using network. Should be both faster and work with Heruko
    // since they apparently have some restrictions on local network requests
    const options = {networkInterface: createLocalInterface(graphql, schema,{rootValue: { request: req, response: res }}),ssrMode: true};
    // Sets up Apollo client to load data when rendering
    const client = new ApolloClient(options);

    // Sets correct initial Redux state, indicating if we are logged in or not
    let loginState = (req != null && req.user != null);

    // Explicitly set up apollo store, which we also use as our own Redux store
    const store = createStore(
        combineReducers({
            ...reducers,
            //isLoggedIn: (state = loginState,action) => state,
            apollo: client.reducer()
        }),
        {isLoggedIn: loginState}, // Initial state
        // Dunno if this is necessary, my guess is only we define middleware, but we might do server side middleware
        // some day :)
        compose(
            applyMiddleware(client.middleware())
        )
    );
    // This context object contains the results of the render
    const context = {};

    // Sets up app to be rendered
    var app = (
        <ApolloProvider store={store} client={client}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </ApolloProvider>
    );

    // Renders app with data loaded, and Redux store initial state propagated
    const html = await renderToStringWithData(app);

    // Sets initial state for apollo, so client bundle knows what is loaded and whatnot
    const preloadedState = store.getState();

    // TODO 404's ?!?!?!
    // context.url will contain the URL to redirect to if a <Redirect> was used
    //if (context.url) {
        // TODO This is not correct, should give location in header, see: http://www.restapitutorial.com/httpstatuscodes.html
        // We might wnat to do status code 302 for redirects, or maybe just forget about it?
    //    res.redirect(context.url);
    //} else {
        // Send the rendered page back to the client
    res.status(200).send(renderFullPage(html, preloadedState));
    //}
}

/**
 * Renders react app instance to a html document
 **/
function renderFullPage(html, preloadedState){
    // Loads all of app css statically, which is statically compiled.
    const css = fs.readFileSync('./dist/public/styles.css');
    return `
        <!doctype html>
        <html>
            <head>
                <title>Madklub</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style type="text/css">${css}</style>
            </head>
            <body>
                <div id="react-view">${html}</div>
                <script>
                    // WARNING: See the following for Security isues with this approach:
                    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
                </script>
                <script type="application/javascript" src="/bundle.js"></script>
            </body>
        </html>
    `
}

/**
 * Site requests are handled here, takes care of routing and server-side rendering
 **/
/* Old way with react-router < v4, kept because new one is in beta
app.use((req, res) => {
    console.log('Page request! Client asked for '+req.url);
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if(error){
            res.status(500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your "not found" component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            handleRender(renderProps,req,res)
            //res.status(200).send(
            //    renderFullPage(renderToString(<RouterContext {...renderProps} />))
            //)
        } else {
            //TODO: make a nicer 404 page
            res.status(404).send('Not found')
        }
    });
});
*/
app.use((req,res)=>{
    handleRender(req,res);
});

//
// Launch the server
// -----------------------------------------------------------------------------
db.sequelize.sync({force: false}).then(async function () {
    console.log('Models are synced up!');
    //testSet(db);
    // Launching server
    app.listen(port, function onAppListen(err){
        if(err) {
            console.error(err);
        } else {
            console.info('==> [] Webpack development server on port: %s',port);
        }
    });
}).catch((err)=>{
    console.log(err);
    console.log(err.sql);
});
