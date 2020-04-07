const CopyPlugin = require("copy-webpack-plugin");
const Path = require("path");

let nodeEnv = process.env.NODE_ENV;
console.log(`Webpack Process Env: ${nodeEnv}`);
const templateDir = `templates/${nodeEnv}`;

module.exports = {
  entry: "./src/js/404.js",
  context: Path.resolve(__dirname, "../")
  //plugins: [new CopyPlugin([{ from: "src/html", to: `../../${templateDir}/` }])]
};
