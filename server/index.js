import "babel-polyfill";
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var fs = require('fs');

import React from 'react';
// Server functionality related imports
import cookieParser from 'cookie-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import schema from './api/schema';
import { port, auth, analytics } from './config';
import db from './api/db/index';
import registerLoginFacebookMiddleware from './login/facebook_login';
import testSet from './api/db/test_set';
// Imports for server rendering
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import routes from '../app/routes';

const crypto = require('crypto');
const app = express();

// Setup hot loading and dev stuff
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

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

/* TODO Make csrf token vertification with double submit cookies
 * by generating a random csrf token for each request with privileges.
 * Implement 'Cookie-to-Header Token' also called 'Bearer authentication' which Relay can do like this:
 * http://stackoverflow.com/questions/32618424/where-do-you-put-the-csrf-token-in-relay-graphql.
 * But with cookie to header instead (instead of meta tag)
 * If the hacker tricks a user into submitting some request, he would have to guess the csrf token,
 * which would be impossible because new one is generated with each request.*/
// TODO only generate and check csrf tokens on each mutation, because mutations are what should be protected
// Generates a random sequence, which we use as CSRF token
app.use((req,res,next)=>{
    //console.log("Sup: "+req.cookies.csrf_token);
    var id = crypto.randomBytes(20).toString('hex');
    res.cookie('csrf_token', id, {httpOnly: false});
    next();
});

registerLoginFacebookMiddleware(app);

//
// Register API login
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
function handleRender(renderProps,res){
    // Create a new Redux store instance
    // const store = createStore(counterApp)
    //
    // Render the component to a string
    // const html = renderToString(
    //     <Provider store={store}>
    //         <App />
    //     </Provider>
    // )
    //
    // Grab the initial state from our Redux store
    // const preloadedState = store.getState()
    //
    const html = renderToString(<RouterContext {...renderProps} />);
    const preloadedState = {};
    // Send the rendered page back to the client
    res.status(200).send(renderFullPage(html, preloadedState))
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
                <style type="text/css">${css}</style>
            </head>
            <body>
                <div id="react-view">${html}</div>
                <script>
                    // WARNING: See the following for Security isues with this approach:
                    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                    // window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
                </script>
                <script type="application/javascript" src="/bundle.js"></script>
            </body>
        </html>
    `
}

/**
 * Site requests are handled here, takes care of routing and server-side rendering
 **/
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
            handleRender(renderProps,res)
            //res.status(200).send(
            //    renderFullPage(renderToString(<RouterContext {...renderProps} />))
            //)
        } else {
            //TODO: make a nicer 404 page
            res.status(404).send('Not found')
        }
    });
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
