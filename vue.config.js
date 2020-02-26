const path = require('path');

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '/hijacker/',
  outputDir: 'lib/frontend',
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
  }
};
