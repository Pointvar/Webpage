const Pages = require("./webpack.entry");

let entrys = {};
Pages.forEach((page) => {
  const pageEntry = page.entry;
  entrys[pageEntry] = `./src/pages/${pageEntry}.js`;
});
module.exports = {
  entry: entrys,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
