/**
 * Created by peter on 2/5/17.
 */

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x){
        return ['.bin'].indexOf(x) === -1;
    }).forEach(function(mod){
    nodeModules[mod] = 'commonjs ' + mod;
});

function replacePath(newResource){
    let request = newResource.request;
    console.log('Replacing '+request);
    newResource.request = request.replace(/async_version$/,'sync_version');
    console.log("With "+newResource.request);
    return newResource;
}

module.exports = {
    entry: [
        'babel-polyfill',
        './server'],
    target: 'node',
    // Backend should be in the protected dist (distribution) folder
    output: {
        path: path.join(__dirname,'dist/'),
        publicPath: '/public/',
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        // Set environment variable
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        // Plugin to NOT split if we by error encounter an import() or require.ensure
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        // Makes sure we use synchronous components on server side
        new webpack.NormalModuleReplacementPlugin(
            /\/async_version/,
            replacePath
            //'/sync_component'
        ),
        // Optimization, uglify added by -p option of webpack
        //new webpack.optimize.UglifyJsPlugin(),
        // Client bundler takes care of css
        //new ExtractTextPlugin({
        //    filename: "/public/styles.css",
        //    disable: false,
        //    allChunks: true
        //})
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            { test: /\.css$/, loader: 'ignore-loader' }
        ]
    },
    devtool: 'sourcemap'
}
