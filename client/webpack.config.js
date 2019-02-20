/**
 * Project:  valueinfinity-mvp-client
 * File:     /webpack.config.js
 * Created:  2019-02-19 21:44:32
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-19 21:44:32
 * Editor:   Darrin Tisdale
 */

module.exports = {
  entry: "./src/app.js",
  output: {
    path: __dirname + "/build/js",
    filename: "build.js"
  },
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: "./node_modules/", loader: "eslint-loader" }
    ],
    loaders: [
      { test: /\.js$/, exclude: "./node_modules/", loader: "babel-loader" }
    ]
  },
  eslint: {
    emitError: true,
    emitWarning: true,
    failOnError: true,
    failOnWarning: true
  }
};
