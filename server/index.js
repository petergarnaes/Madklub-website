require("source-map-support").install();
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
import RegisterComponentContainer from '../app/async/component_register_container';

const crypto = require('crypto');
const app = express();

// Setup hot loading and dev stuff
var compiler = webpack(config);

if(process.env.NODE_ENV === 'development') {
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());


//
// Setup production resources
// -----------------------------------------------------------------------------

// Chunk manifest used by the webpack loader. Inlined in our http responses so their bundle loader can fetch the
// correct bundle while we still maintain the ability to cache bust. Moved to this separate inlined piece of code,
// so our entry file does not need to contain it, and thereby change hash on every update, big or small!
var chunkManifest = '{}';
// json object that can map bundle names to their full names including hash. Useful for figuring out our production
// bundles full name, and putting required modules (main bundle + any async route rendered on server) as <preload/>,
// for absolutely fastest load and avoid waterfall download.
var chunkMapManifest = {};

// If production, we initialize the manifests
if(process.env.NODE_ENV === 'production'){
    // Setup stuff for asynchronous code split name+hash resolving
    chunkManifest = fs.readFileSync('./dist/public/chunk-manifest.json');
    chunkMapManifest = JSON.parse(fs.readFileSync('./dist/public/chunk-map-manifest.json'));
    // Matches routes ending in either js or css. Because we gzip our code and css, we must instruct the browser so it
    // decrypts it
    // TODO handle css compressed with gzip when we figure css out
    console.log("We register right?");
    app.get(/.+\.js$/, function (req, res, next) {
        // TODO find a way to solve this better so we avoid name clashes
        if(!req.url.includes('manifest')){
            res.set('Content-Encoding', 'gzip');
        }
        next();
    });
}

app.use('/public', express.static('./dist/public'));

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

    // Will be mutated by RegisterComponentContainer to contain the keys components that the client should know about
    var registered_components = [];

    // Sets up app to be rendered
    var app = (
        <ApolloProvider store={store} client={client}>
            <StaticRouter location={req.url} context={context}>
                <RegisterComponentContainer registeredComponents={registered_components}>
                    <App />
                </RegisterComponentContainer>
            </StaticRouter>
        </ApolloProvider>
    );

    // Renders app with data loaded, and Redux store initial state propagated
    const html = await renderToStringWithData(app);

    console.log('We now registered:');
    console.log(registered_components);
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
    res.status(200).send(renderFullPage(html, preloadedState,registered_components));
    //}
}

/**
 * Renders react app instance to a html document
 **/
function renderFullPage(html, preloadedState,registered_components){
    // Loads all of app css statically, which is statically compiled.
    // TODO
    const css = fs.readFileSync('./dist/public/styles.css');
    var preloads = '';
    var prefetches = '';
    // This is developer name of bundle
    var mainFullName = 'main.js';
    // Since development is one big bundle, we only do manifest and vendor on production.
    var manifestDecl = '';
    var vendorDecl = '';
    // This will setup preload/prefetch statements for both main bundle, as well as
    if(process.env.NODE_ENV === 'production'){
        let manifestFullName = chunkMapManifest['manifest.js'];
        preloads += '<link rel="preload" href="/public/'+manifestFullName+'" as="script">\n';
        prefetches += '<link rel="prefetch" href="/public/'+manifestFullName+'">\n';
        manifestDecl = '<script type="application/javascript" src="/public/'+manifestFullName+'"></script>';
        mainFullName = chunkMapManifest['main.js'];
        preloads += '<link rel="preload" href="/public/'+mainFullName+'" as="script">\n';
        prefetches += '<link rel="prefetch" href="/public/'+mainFullName+'">\n';
        var vendorFullName = chunkMapManifest['vendor.js'];
        preloads += '<link rel="preload" href="/public/'+vendorFullName+'" as="script">\n';
        prefetches += '<link rel="prefetch" href="/public/'+vendorFullName+'">\n';
        vendorDecl = '<script type="application/javascript" src="/public/'+vendorFullName+'"></script>';
        registered_components.forEach((route)=>{
            // Keys MUST match up with chunk name (declared by require.ensure).
            let chunkFullName = chunkMapManifest[route+'.js'];
            preloads += '<link rel="preload" href="/public/'+chunkFullName+'" as="script">\n';
            prefetches += '<link rel="prefetch" href="/public/'+chunkFullName+'">\n';
        });
    }

    return `<!DOCTYPE html>
        <html>
            <head>
                <title>Madklub</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script>
                window.webpackManifest = ${chunkManifest}
                </script>
                ${preloads}
                ${prefetches}
                <style type="text/css">${css}</style>
            </head>
            <body>
                <div id="react-view">${html}</div>
                <script>
                    // WARNING: See the following for Security isues with this approach:
                    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)};
                    window.__REGISTERED_COMPONENTS__ = ${JSON.stringify(registered_components)}
                </script>
                ${manifestDecl}
                ${vendorDecl}
                <script type="application/javascript" src="/public/${mainFullName}"></script>
            </body>
        </html>
    `
}

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
