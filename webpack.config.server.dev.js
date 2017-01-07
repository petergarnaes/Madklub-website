var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x){
        return ['.bin'].indexOf(x) === -1;
    }).forEach(function(mod){
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './server.js',
    target: 'node',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot','babel'],
                exclude: /node_modules/
            }
        ]
    }
}
