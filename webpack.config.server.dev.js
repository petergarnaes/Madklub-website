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
    entry: ['babel-polyfill','./server'],
    target: 'node',
    output: {
        path: path.join(__dirname,'dist/'),
        publicPath: '/public/',
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false }),
        new ExtractTextPlugin("/public/styles.css",{
            allChunks: true
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot','babel'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader?root=public/")
            },
            {
                test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                query: {
                    publicPath: 'public/',
                    outputPath: 'public/',
                    name: '[hash].[ext]'
                }
           }
        ]
    },
    devtool: 'sourcemap'
}
