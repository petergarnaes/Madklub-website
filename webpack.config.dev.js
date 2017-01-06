var path = require('path');
var webpack = require('webpack');

var config = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './client/index.js'
    ],
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
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
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
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
    }
};

module.exports = config;
