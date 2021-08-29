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
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: path.resolve(__dirname, "../build"),
    compress: true,
    writeToDisk: true,
    disableHostCheck: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: {
      "/ajax_": {
        target: "http://localhost:80/",
      },
    },
  },
});
module.exports = webpackDev;
