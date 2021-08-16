const { merge } = require("webpack-merge");
const path = require("path");
const webpackBase = require("./webpack.base");
let webpackDev = merge(webpackBase, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build/js"),
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: path.resolve(__dirname, "../build"),
    compress: true,
    writeToDisk: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: {
      "/ajax_": {
        target: "http://localhost:8001/",
      },
    },
  },
});
module.exports = webpackDev;
