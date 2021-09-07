const path = require("path");
const webpackBase = require("./webpack.base");
const { merge } = require("webpack-merge");

let webpackDev = merge(webpackBase, {
  mode: "production",
  output: {
    filename: "[name][chunkhash:5].js",
    path: path.resolve(__dirname, "../dist/js"),
    chunkFilename: "[name][chunkhash:5].js",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /node_modules/,
          priority: 100,
          chunks: "all",
        },
        common: {
          name: "common",
          minChunks: 2,
          priority: 90,
          chunks: "all",
          reuseExistingChunk: true,
        },
      },
    },
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
            maxSize: 4 * 1024,
          },
        },
      },
    ],
  },
});
module.exports = webpackDev;
