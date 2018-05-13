const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/frontend/main.js',
  output: {
    filename: 'js/main.js',
    path: path.resolve(__dirname, './lib/frontend')
  },
  module: {
    rules: [
      // Vue single-file components
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    // Extensions to automatically resolve when importing/requiring
    extensions: [".js", ".json", ".vue"],

    // Alias for import/require shortcuts
    alias: {
      "@": path.resolve(__dirname, "src/frontend")
    }
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
    }),

    // Vue Loader Plugin (https://vue-loader.vuejs.org/guide/#manual-configuration)
    new VueLoaderPlugin()
  ]
}
