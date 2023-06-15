/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.join("dist"),
    host: "0.0.0.0",
    port: 8080,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/favicon.ico", to: "" },
        { from: "public/print.svg", to: "" },
      ],
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
};
