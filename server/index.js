var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var fs = require('fs');

import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import routes from '../app/routes';

var port = 3000;
const app = express();

// Setup hot loading and dev stuff
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

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

// Launching server
app.listen(port, function onAppListen(err){
    if(err) {
        console.error(err);
    } else {
        console.info('==> [] Webpack development server on port: %s',port);
    }
});
