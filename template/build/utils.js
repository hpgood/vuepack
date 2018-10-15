'use strict'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./config')

const _ = module.exports = {}

_.cwd = (file) => {
  return path.join(process.cwd(), file || '')
}

_.cssLoaderModule = 'css-loader?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
_.cssLoaderNoModule = 'css-loader?-autoprefixer'

_.cssProcessors = [
  {loader: '', test: /(\-ui)+.+\.css$/, moudle: false },//mint-ui,element-ui don't need moudule!
  {loader: '', test: /^((?!\-ui).)+\.css$/, moudle: config.cssModules },
  {loader: 'sass-loader?sourceMap', test: /\.scss$/, moudle: config.cssModules },
  {loader: 'less-loader?sourceMap', test: /\.less$/, moudle: config.cssModules },
  {loader: 'stylus-loader?sourceMap', test: /\.styl$/, moudle: config.cssModules },
  {loader: 'sass-loader?indentedSyntax&sourceMap', test: /\.sass$/, moudle: config.cssModules },
]

_.outputPath = config.electron ?
  path.join(__dirname, '../app/' + config.dist) :
  path.join(__dirname, '../' + config.dist)

_.outputIndexPath = config.electron ?
  path.join(__dirname, '../app/', config.dist, '/index.html') :
  path.join(__dirname, '../', config.dist, '/index.html')

_.target = config.electron ?
  'electron-renderer' :
  'web'

// https://github.com/egoist/vbuild/blob/master/lib/vue-loaders.js
_.loadersOptions = () => {
  const isProd = process.env.NODE_ENV === 'production'

  function generateLoader(langs) {
    langs.unshift('css-loader?sourceMap&-autoprefixer')
    if (!isProd) {
      return ['vue-style-loader'].concat(langs).join('!')
    }
    return ExtractTextPlugin.extract({
      fallback: 'vue-style-loader',
      use: langs.join('!')
    })
  }

  return {
    minimize: isProd,
    options: {
      // css-loader relies on context
      context: process.cwd(),
      vue: {
        loaders: {
          css: generateLoader([]),
          sass: generateLoader(['sass-loader?indentedSyntax&sourceMap']),
          scss: generateLoader(['sass-loader?sourceMap']),
          less: generateLoader(['less-loader?sourceMap']),
          stylus: generateLoader(['stylus-loader?sourceMap']),
          js: 'babel-loader'
        }
      }
    }
  }
}
