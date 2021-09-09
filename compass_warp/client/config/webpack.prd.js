const path = require("path");
const webpackBase = require("./webpack.base");
const { merge } = require("webpack-merge");
const pages = require("./webpack.entry");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require("html-webpack-plugin");

let webpackPrd = merge(webpackBase, {
  mode: "production",
  output: {
    filename: "js/[name]_[contenthash:6].js",
    path: path.resolve(__dirname, "../dist"),
    chunkFilename: "js/[name]_[contenthash:6].js",
    assetModuleFilename: "asset/[name]_[contenthash:6][ext][query]",
    clean: true,
    publicPath: "/static/",
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name]_[contenthash:6].css",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
    }),
  ],
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
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

// 自动生成Html文件
for (let page of pages) {
  const htmlConf = {
    title: "快捷搬家 | " + page.title,
    filename: "templates/" + page.entry + ".html",
    template: "./src/pages/index.html",
    chunks: ["vendor", "common", page.entry],
  };
  webpackPrd.plugins.push(new HtmlWebpackPlugin(htmlConf));
}

module.exports = webpackPrd;
