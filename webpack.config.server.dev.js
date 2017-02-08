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

function replacePath(newResource){
    let request = newResource.request;
    console.log('Replacing '+request);
    newResource.request = request.replace(/async_version$/,'sync_version');
    console.log("With "+newResource.request);
    //console.log(newResource);
    return newResource;
}

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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.NormalModuleReplacementPlugin(
            /\/async_version/,
            replacePath
            //'/sync_component'
        ),
        //new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
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
                    publicPath: '/public/',
                    outputPath: '/public/',
                    name: '[name].[ext]'
                }
           }
        ]
    },
    devtool: 'sourcemap'
}
