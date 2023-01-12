const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    path: path.join(__dirname, "/dist"), 
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
        name: "index.html",
        inject: false,
        template: path.resolve(__dirname, "src/index.html"),
      }),
  ],
  devServer: {
    port: 3040, 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/, 
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, 
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};