/* eslint-disable */
const path = require("path");

module.exports = (env, argv) => {
  return {
    entry: {
      index: path.resolve(__dirname, "./dist/index.js"),
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "mrroinpayment.js",
      library: "mrroinpayment",
      libraryTarget: "umd",
      globalObject: "this",
    },
    module: {
      rules: [
        {
          test: /\.ts|tsx?$/,
          exclude: /node_modules/,
          loader: ["ts-loader"],
        },
      ],
    },
  };
};
