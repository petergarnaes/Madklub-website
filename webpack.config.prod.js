var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin");
var ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackChunkHash = require("webpack-chunk-hash");

function isVendor(module) {
    // this assumes your vendor imports exist in the node_modules directory
    return module.context && module.context.indexOf('node_modules') !== -1;
}

var config = {
    //devtool: 'cheap-module-source-map',
    entry: {
        main: './client/index.js',
        //polyfills: [
        //    `babel-polyfill`,
        //    `whatwg-fetch`
        //],
        //apollo: 'apollo-client'
    },
    output: {
        path: path.join(__dirname,'dist/public'),
        publicPath: '/public/',
        filename: '[name].[chunkhash].js',
        chunkFilename: "[name].[chunkhash].js"
    },
    plugins: [
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'static',
            // Automatically open report in default browser
            openAnalyzer: false,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        }),
        // To extract css, to make the bundle itself smaller, will load css and other recourses with url loader
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: false,
            allChunks: true
        }),
        // Only includes desired locales in moment.js, I assume en (united states) is default included. We further
        // include Danish and Faroese
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /da|fo/),
        // TODO use plugin like this to remove 'promise' module from client bundle

        // Maybe this does something DID NOTHING - we probably need several entries and such
        //new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        // Creates library package, by finding dependencies of app entry point, and include it if it is in node_modules
        // (see isVendor)
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        // Creates a manifest file, which is somehow necessary to keep vendor chunkhash the same if nothing changed.
        /*new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'], // Specify the common bundle's name.
            minChunks: isVendor
        }),*/
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
        new webpack.HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest"
        }),
        new ManifestPlugin({
            fileName: 'chunk-map-manifest.json'
        }),
        new CompressionPlugin({
            asset: "[path]",
            algorithm: "gzip",
            // TODO add css ie. '|\.css$' when css has been properly dealt with
            test: /\.js$|\.html$|\.css$/,
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
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
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

/*
* // Client specific loading of these file types
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
