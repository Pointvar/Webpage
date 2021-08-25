const { merge } = require("webpack-merge");
const path = require("path");
const webpackBase = require("./webpack.base");
console.log(path.resolve(__dirname, "dist"));
let webpackDev = merge(webpackBase, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
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
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images/",
            },
          },
        ],
      },
    ],
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
