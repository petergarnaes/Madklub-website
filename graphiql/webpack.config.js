/**
 * Created by peter on 5/3/17.
 */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');

var config = {
    entry: {
        graphiql: './graphiql/index.js'
        //polyfills: [
        //    `babel-polyfill`,
        //    `whatwg-fetch`
        //],
        //apollo: 'apollo-client'
    },
    output: {
        path: path.join(__dirname,'../dist/public'),
        publicPath: '/public/',
        filename: '[name].[chunkhash].js',
        chunkFilename: "[name].[chunkhash].js"
    },
    plugins: [
        /*new CopyWebpackPlugin([
            { from: 'node_modules/graphiql/graphiql.css', to: 'api_editor_style.css'}
        ]),*/
        new ExtractTextPlugin("api_editor_style.css"),
        new HtmlWebpackPlugin({
            chunks: ['graphiql'],
            title: 'API editor',
            filename: 'api_editor.html',
            template: 'graphiql/api_editor.ejs'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
         assets: ['api_editor_style.css'],
         append: false
         }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/yeti.css'],
            publicPath: false,
            append: false
        }),
        new ResourceHintWebpackPlugin(),
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
            minimize: true,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true,
                //drop_console: true, // strips console statements
                unused: true,
                dead_code: true, // big one--strip code that will never execute
            },
            comments: false
        }),
        new CompressionPlugin({
            asset: "[path]",
            algorithm: "gzip",
            // TODO add css ie. '|\.css$' when css has been properly dealt with
            test: /\.js$|\.css$/,
            threshold: 0,
            minRatio: 0.5
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                //loader: ExtractTextPlugin.extract("style-loader","css-loader?root=public/"),
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    use: {
                        loader: "css-loader",
                        // options: { minimize: true } // Somehow made it bigger?!
                    },
                    //loader: "css-loader",
                    publicPath: "/public/"})
            },
            {
                test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    publicPath: '/public/',
                    name: '[name].[ext]'
                }
            }
        ]
    }
};

module.exports = config;

