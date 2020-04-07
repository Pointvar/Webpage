const merger = require("webpack-merge");
const Path = require("path");
const baseConfig = require("./webpack.base");
const context = baseConfig.context;

const DevConfig = merger(baseConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  output: {
    path: Path.resolve(context, "../static/dist_dev"),
    filename: "js/[name].js",
    publicPath: "static/dist_dev",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader", "eslint-loader"],
      },
    ],
  },
});

module.exports = DevConfig;
