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

//new webpack.NormalModuleReplacementPlugin(/\.css$/, 'node-noop')

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
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true,
                drop_console: true, // strips console statements
                unused: true,
                dead_code: true, // big one--strip code that will never execute
            },
            comments: false
        }),
        new ExtractTextPlugin({
            filename: "/public/styles.css",
            disable: false,
            allChunks: true
        })
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
