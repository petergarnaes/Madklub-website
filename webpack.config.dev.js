var path = require('path');
var webpack = require('webpack');

var config = {
    devtool: 'sourcemap',
    entry: [
        'webpack-hot-middleware/client',
        './client/index.js'
    ],
    // Bundle should be in public folder
    output: {
        path: path.join(__dirname,'dist/public/'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: [{
                        loader: 'react-hot-loader'
                    }, {
                        loader: 'babel-loader'

                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },{
                        loader: "css-loader"
                    }
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
                loader: 'url-loader',
                options: {
                    limit: "100000",
                    mimetype: "application/font-woff"
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
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
