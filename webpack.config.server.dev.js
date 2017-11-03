var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var nodeModules = {};
fs
  .readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

//new webpack.NormalModuleReplacementPlugin(/\.css$/, 'node-noop')

function replacePath(newResource) {
  let request = newResource.request;
  console.log("Replacing " + request);
  newResource.request = request.replace(/async_version$/, "sync_version");
  console.log("With " + newResource.request);
  //console.log(newResource);
  return newResource;
}

module.exports = {
  entry: ["./server"],
  target: "node",
  // Backend should be in the protected dist (distribution) folder
  output: {
    path: path.join(__dirname, "dist/"),
    publicPath: "/public/",
    filename: "backend.js"
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
    )
    //new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      { test: /\.css$/, loader: "ignore-loader" }
      // Root parameter sets the root folder of url references
    ]
  },
  devtool: "sourcemap"
};
