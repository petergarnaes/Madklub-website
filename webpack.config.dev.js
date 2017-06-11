var path = require('path');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

function replacePath(newResource){
    let request = newResource.request;
    console.log('Replacing '+request);
    newResource.request = request.replace(/async_version$/,'sync_version');
    console.log("With "+newResource.request);
    //console.log(newResource);
    return newResource;
}

var config = {
    devtool: 'eval',
    entry: {
        main: [
            // activate HMR for React
            //'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            'webpack/hot/only-dev-server',
            // bundle the client for hot reloading
            // only- means to only hot reload for successful updates
            './client/index_dev.js'
        ],
    },
    // Bundle should be in public folder
    output: {
        path: path.join(__dirname,'dist/'),
        filename: 'main.js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /\/async_version/,
            replacePath
            //'/sync_component'
        ),
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
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
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
            }
        ]
    }
};

module.exports = config;
