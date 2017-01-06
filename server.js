var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

//import express from 'express';
import React from 'react';
//var React = require('react');
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import routes from './shared/routes';

var port = 3000;
const app = express();

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

function handleRender(req,res){
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
    // Send the rendered page back to the client
    // res.send(renderFullPage(html, preloadedState))
}

function renderFullPage(html, preloadedState){
    return `
        <!doctype html>
        <html>
            <head>
                <title>Redux Universal Example</title>
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

app.use((req, res) => {
    console.log('Bobby?');
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if(error){
            res.status(500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your "not found" component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            res.status(200).send(
                renderFullPage(renderToString(<RouterContext {...renderProps} />))
            )
        } else {
            res.status(404).send('Not found')
        }
    });/*
      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Isomorphic Redux Demo</title>
        </head>
        <body>
          <div id="react-view"></div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
      `;
  
  res.end(HTML);*/
});

app.listen(port, function onAppListen(err){
    if(err) {
        console.error(err);
    } else {
        console.info('==> [] Webpack development server on port: %s',port);
    }
});
//export default app;
