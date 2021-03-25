const { resolve, join } = require('path')
const webpack = require('webpack')

module.exports = {
   mode: 'development',
   entry: {
      vendor: [
         'react',
         'react-dom',
         'aphrodite',
         'axios',
         'classnames',
         'nanoid',
         'react-helmet',
         'react-icons',
         'react-router-dom',
         'react-table',
         'react-use',
      ],
   },
   output: {
      filename: 'vendor.bundle.js',
      path: resolve(__dirname, '../public/vendor'),
      library: 'vendor',
   },
   plugins: [
      new webpack.DllPlugin({
         name: 'vendor',
         path: join(__dirname, '../public/vendor', 'manifest.json'),
      }),
   ],
}
