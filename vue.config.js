const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '/hijacker/',
  outputDir: './lib/frontend',
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./src/frontend/src/main.js')
      .end();
    config.resolve.alias
      .set('@', path.join(__dirname, './src/frontend/src'))

    // Alternative to .env files
    config
      .plugin('define')
      .tap(args => {
        return [{
          ...args[0],
          SOCKET_HOST: isProd ? '' : JSON.stringify('http://localhost:3000')
        }]
      })

    // Fix html template plugin
    config
      .plugin('html')
      .tap(args => {
        return [{
          ...args[0],
          template: './src/frontend/public/index.html'
        }]
      })

    // Move Public Folder
    config
      .plugin('copy')
      .use(CopyPlugin, [
        [{
          from: './src/frontend/public',
          toType: 'dir',
          ignore: [
            '.DS_Store',
            {
              glob: 'index.html',
              matchBase: false
            }
          ]
        }]
      ])

    // Monaco Setup
    config
      .plugin('monaco')
      .use(MonacoWebpackPlugin, [
        {
          languages: ["javascript", "typescript", "json"],
        }
      ])
  }
}
