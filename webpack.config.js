var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')

// var browserConfig = {
//   entry: './src/browser/index.js',
//   output: {
//     path: path.resolve(__dirname, 'public'),
//     filename: 'bundle.js',
//     publicPath: '/'
//   },
//   module: {
//     rules: [
//       { test: /\.(js)$/, use: 'babel-loader' },
//       { test: /\.css$/, loader: 'style-loader!css-loader' }
//     ]
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       __isBrowser__: "true"
//     })
//   ]
// }

var serverConfig = {
  entry: './src/app',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/'
  },
  node: {
        __dirname: false,
        __filename: false
    },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      // { test: /\.css$/,
      //   use: [
      //     'isomorphic-style-loader',
      //     { loader: 'css-loader',
      //       options: {
      //         importLoaders: 1
      //       }
      //     },
      //     'postcss-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
}

//module.exports = [browserConfig, serverConfig]
module.exports = [ serverConfig ]