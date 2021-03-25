const webpack = require('webpack')
const { resolve } = require('path')
const DevServer = require('webpack-dev-server')
const config = require('./webpack.config')
const ErrorOverlay = require('error-overlay-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefresh = new ReactRefreshPlugin({ overlay: false })
const HMRPlugin = new webpack.HotModuleReplacementPlugin()
const ErrPlugin = new ErrorOverlay()
const dllReferencePlugin = new webpack.DllReferencePlugin({
   context: __dirname,
   manifest: resolve(__dirname, '../public/vendor/manifest.json'),
})

const devEntry = [
   'webpack-dev-server/client?http://localhost:8080',
   'webpack/hot/only-dev-server',
]

const devPlugins = [HMRPlugin, ErrPlugin, ReactRefresh]

config.entry.unshift(...devEntry)
config.module.rules[0].use.options.plugins.push('react-refresh/babel')
config.plugins.splice(2, 1, ...devPlugins)
config.optimization = {
   runtimeChunk: 'single',
}
Object.assign(config, {
   devtool: 'cheap-module-source-map',
})
const compiler = webpack(config)
const devServerOptions = {
   contentBase: config.output.path,
   publicPath: config.output.publicPath,
   hot: true,
   hotOnly: true,
   liveReload: false,
   historyApiFallback: true,
   stats: 'errors-warnings',
   headers: {
      'Access-Control-Allow-Origin': '*',
   },
   proxy: {
      '/api': {
         target: 'http://localhost:7800',
         changeOrigin: true,
         ws: false,
         secure: false,
      },
   },
}

const server = new DevServer(compiler, devServerOptions)

server.listen(8080)
