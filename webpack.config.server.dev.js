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
    // Backend should be in the protected dist (distribution) folder
    output: {
        path: path.join(__dirname,'dist/'),
        publicPath: '/public/',
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false }),
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
                use: [{
                        loader: 'react-hot-loader'
                    }, {
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/
            },
            // Root parameter sets the root folder of url references
            {
                test: /\.css$/,
                //loader: ExtractTextPlugin.extract("style-loader","css-loader?root=public/"),
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: "css-loader",
                    publicPath: "/public/"})
            },
            // We ensure all files loaded server side are put in the public folder
            {
                test: /\.(woff|woff2|png|jpg|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    publicPath: 'public/',
                    outputPath: 'public/',
                    name: '[hash].[ext]'
                }
           }
        ]
    },
    devtool: 'sourcemap'
}
