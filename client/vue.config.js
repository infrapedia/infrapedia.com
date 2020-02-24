const WebpackBar = require('webpackbar')

module.exports = {
  configureWebpack: {
    plugins: [new WebpackBar()]
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true
      })
  }
}
