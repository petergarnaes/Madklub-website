var path = require('path');
var webpack = require('webpack');

var config = {
    devtool: 'inline-source-map',
    entry: [
        // activate HMR for React
        //'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        './client/index_dev.js'
    ],
    // Bundle should be in public folder
    output: {
        path: path.join(__dirname,'dist/'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                // {
                //loader: 'react-hot-loader'
                //},
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            { test: /\.css$/, loader: 'ignore-loader' }
        ]
    }
};
/*
* ,
 {
 test: /\.css$/,
 use: [
 "style-loader",
 "css-loader?modules",
 "postcss-loader"
 ]
 },
 // Client specific loading of these file types
 {
 test: /\.png$/,
 loader: "url-loader" ,
 options: {
 limit: "100000"
 }
 },
 {
 test: /\.jpg$/,
 loader: "file-loader"
 },
 // Client specific font loading, retrieved with HTTP requests with the url-loader.
 {
 test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
 //loader: 'file-loader'
 loader: 'url-loader',
 options: {
 limit: "100000",
 mimetype: "application/font-woff"
 }
 },
 {
 test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
 //loader: 'file-loader'
 loader: 'url-loader',
 options: {
 limit: "100000",
 mimetype: "application/octet-stream"
 }
 },
 {
 test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
 loader: 'file-loader'
 },
 {
 test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
 loader: 'url-loader',
 options: {
 limit: "100000",
 mimetype: "image/svg+xml"
 }
 }*/

module.exports = config;
