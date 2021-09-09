const { merge } = require("webpack-merge");
const path = require("path");
const pages = require("./webpack.entry");
const webpackBase = require("./webpack.base");
var HtmlWebpackPlugin = require("html-webpack-plugin");

let webpackDev = merge(webpackBase, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "../build/"),
    clean: true,
  },
  plugins: [],
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
            maxSize: 4 * 1024,
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
        target: "http://localhost:8001/",
      },
    },
  },
});

for (let page of pages) {
  const htmlConf = {
    title: "快捷搬家 | " + page.title,
    filename: page.entry,
    template: "./src/pages/index.html",
    chunks: [page.entry],
  };
  webpackDev.plugins.push(new HtmlWebpackPlugin(htmlConf));
}
module.exports = webpackDev;
