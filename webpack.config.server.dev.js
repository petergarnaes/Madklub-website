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
    entry: './server',
    target: 'node',
    output: {
        path: path.join(__dirname,'dist'),
        publicPath: path.join(__dirname,'dist/public'),
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false }),
        new ExtractTextPlugin("public/styles.css",{
            publicPath: '/public/',
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
                loader: ExtractTextPlugin.extract("style-loader","css-loader")
            },
            { 
                test: /\.png$/, 
                loader: "url-loader?limit=100000" 
            },
            { 
                test: /\.jpg$/, 
                loader: "file-loader" 
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url?limit=10000&mimetype=application/font-woff'
           },
           {
               test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
               loader: 'url?limit=10000&mimetype=application/octet-stream'
           },
           {
               test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
               loader: 'file'
           },
           {
               test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
               loader: 'url?limit=10000&mimetype=image/svg+xml'
           }
        ]
    },
    devtool: 'sourcemap'
}
