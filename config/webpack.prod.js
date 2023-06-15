/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Production",
      filename: "index.html",
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "public/favicon.ico", to: "" }],
    }),
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "mrroinwebsdk.js",
    library: "mrroinwebsdk",
    libraryTarget: "umd",
  },
  stats: {
    colors: true,
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: [
    // "@mrroin/mrroin-web-bus",
    // "@mrroin/mrroin-web-sdkcrypto",
    // "@mrroin/mrroinsdknative",
    // "@prescott/geo-pattern",
    // "@regulaforensics/vp-frontend-document-components",
    // "@zip.js/zip.js",
    // "crypto-js",
    // "hero-patterns",
    // "js-camera",
    // "jsonwebtoken",
    // "lodash",
    // "lz-string",
    // "pica",
    // "pouchdb-adapter-idb",
    // "qr-scanner",
    // "rxdb",
    // "rxjs",
    // "single-spa",
    // "unzip-js",
    // "uuid",
  ],
};
