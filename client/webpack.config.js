const { resolve } = require('path')
const webpack = require('webpack')
const ESLintWebpack = require('eslint-webpack-plugin')
const HTMLWebpack = require('html-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')

mode = process.env.NODE_ENV || 'production'
const Eslint = new ESLintWebpack({ fix: true })
const ProvidePlugin = new webpack.ProvidePlugin({
   React: 'react',
})
const HTMLPlugin = new HTMLWebpack({
   title: 'Reader - Home',
   template: resolve(__dirname, 'temp/index.html'),
   filename: 'index.html',
   favicon: resolve(__dirname, 'temp/icon.png'),
   meta: {
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
   },
})
const Favicons = new FaviconsPlugin({
   logo: resolve(__dirname, 'temp/icon.png'),
   mode: 'auto',
   prefix: 'assets/',
   favicons: {
      appName: 'Secret Manga Reader',
      appDescription: 'Manga Reader by SB, contains explicit content',
      developerName: 'SB',
      background: '#cdc',
      theme_color: '#aac',
      version: '1.1.0',
      display: 'browser',
      icons: {
         android: true,
         appleIcon: false,
         appleStartup: false,
         coast: false,
         favicons: false,
         firefox: true,
         windows: true,
         yandex: false,
      },
   },
})

module.exports = {
   mode: mode,
   stats: 'errors-warnings',
   resolve: {
      extensions: ['.js', '.jsx'],
   },
   entry: ['./src/index.js'],
   output: {
      path: resolve(__dirname, '../public'),
      filename: '[name].[fullhash].js',
      publicPath: '/',
      clean: true
   },
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            include: resolve(__dirname, 'src'),
            exclude: /node_module/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [
                     '@babel/preset-env',
                     [
                        '@babel/preset-react',
                        {
                           useBuiltIns: 'entry',
                           corejs: '3',
                           targets: {
                              node: '10',
                              browsers: 'last 2 versions',
                           },
                        },
                     ],
                  ],
                  plugins: [
                     [
                        '@babel/plugin-transform-runtime',
                        {
                           regenerator: true,
                        },
                     ],
                  ],
               },
            },
         },
         {
            test: /\.(scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
         },{
            test: /\.(css)$/,
            use: ['style-loader', 'css-loader'],
         },
      ],
   },
   plugins: [Eslint, HTMLPlugin, Favicons, ProvidePlugin],
   optimization: {
      runtimeChunk: 'single',
      splitChunks: { chunks: 'all' },
   },
}
