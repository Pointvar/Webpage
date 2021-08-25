const path = require("path");
const pages = require("./webpack.entry");

let entrys = {};
pages.forEach((page) => {
  const pageEntry = page.entry;
  entrys[pageEntry] = `./src/pages/${pageEntry}`;
});
module.exports = {
  entry: entrys,
  resolve: {
    alias: {
      "@/features": path.resolve(__dirname, "../src/features"),
      "@/actions": path.resolve(__dirname, "../src/actions"),
      "@/apis": path.resolve(__dirname, "../src/apis"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/constants": path.resolve(__dirname, "../src/constants"),
      "@/containers": path.resolve(__dirname, "../src/containers"),
      "@/public": path.resolve(__dirname, "../src/public"),
      "@/reducers": path.resolve(__dirname, "../src/reducers"),
      "@/store": path.resolve(__dirname, "../src/store"),
    },
  },
};
