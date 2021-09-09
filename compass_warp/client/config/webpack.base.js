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
      "@/apis": path.resolve(__dirname, "../src/apis"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/constants": path.resolve(__dirname, "../src/constants"),
      "@/features": path.resolve(__dirname, "../src/features"),
      "@/public": path.resolve(__dirname, "../src/public"),
      "@/store": path.resolve(__dirname, "../src/store"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
    },
  },
};
