const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/frontend/main.js',
  output: {
    filename: 'js/main.js',
    path: path.resolve(__dirname, './lib/frontend')
  },
  module: {
    rules: []
  },
  resolve: {

  },
  plugins: [
    // Move index.html to dist folder and add buldled script
    new HtmlWebpackPlugin({
      template: 'src/frontend/index.html',
      alwaysWriteToDisk: true,
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true
      }
    })
  ]
}
