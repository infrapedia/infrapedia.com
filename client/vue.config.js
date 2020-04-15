const fs = require('fs')
const path = require('path')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const WebpackBar = require('webpackbar')
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const gzip = require('@gfx/zopfli').gzip
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

function getRoutes() {
  let arr = []
  if (process.env === 'production') {
    fs.readdir('./src/pages', (err, files) => {
      arr = Array.from(files)
    })
  }
  return arr
}

const productionPlugins = [
  new PrerenderSpaPlugin({
    staticDir: path.join(__dirname, 'dist'),
    routes: getRoutes(),
    postProcess(renderedRoute) {
      renderedRoute.html = renderedRoute.html
        .replace(/<script (.*?)>/g, '<script $1 defer>')
        .replace('id="app"', 'id="app" data-server-rendered="true"')
      return renderedRoute
    },
    renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
      // We need to inject a value so we're able to
      // detect if the page is currently pre-rendered.
      inject: {},
      // Our view component is rendered after the API
      // request has fetched all the necessary data,
      // so we create a snapshot of the page after the
      // `data-view` attribute exists in the DOM.
      renderAfterElementExists: '[data-view]'
    })
  })
]

module.exports = {
  // publicPath:
  // process.env.NODE_ENV === 'production'
  // ? 'https://cdn1.infrapedia.com/dist/'
  // : '',
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin({
        preset: ['default', { discardComments: { removeAll: true } }]
      })
    ]
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV == 'production') {
      config.plugins.push(...productionPlugins)
      config.plugins.push(
        new CompressionPlugin({
          compressionOptions: { level: 11 },
          threshold: 1250,
          minRatio: 0.8,
          algorithm(input, compressionOptions, callback) {
            return gzip(input, compressionOptions, callback)
          }
        })
      )
    } else {
      config.plugins.push(new WebpackBar())
    }
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true
      })

    // if (process.env.NODE_ENV == 'production') {
    // config.module.rule('gzip-loader').use('gzip-loader')
    // }
  }
}
