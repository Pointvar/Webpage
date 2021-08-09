const CopyPlugin = require("copy-webpack-plugin");
const Path = require("path");
const Pages = require("./webpack.entry");

const entrys = {};
Pages.forEach((page) => {
  const { entry } = page;
  entrys[entry] = `./src/js/${entry}.js`;
});

let nodeEnv = process.env.NODE_ENV;
console.log(`Webpack Process Env: ${nodeEnv}`);
const templateDir = `templates/${nodeEnv}`;

module.exports = {
  entry: entrys,
  context: Path.resolve(__dirname, "../"),
  plugins: [
    new CopyPlugin([{ from: "./src/html", to: `../../${templateDir}` }]),
  ],
};
