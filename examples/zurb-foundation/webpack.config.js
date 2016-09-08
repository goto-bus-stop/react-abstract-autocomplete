const path = require('path');

module.exports = {
  entry: path.join(__dirname, './src/app.js'),

  output: {
    path: __dirname,
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
      },
    ],
  },

  resolve: {
    alias: {
      'react-abstract-autocomplete': path.join(__dirname, '../../src/index.js'),
    },
  },

  devtool: 'source-map',

  devServer: {
    contentBase: __dirname,
    publicPath: '/',
    historyApiFallback: true,
  },
};
