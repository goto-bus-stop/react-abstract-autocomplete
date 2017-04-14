const path = require('path');

module.exports = dirname => ({
  entry: path.join(dirname, './src/app.js'),

  output: {
    path: dirname,
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: require.resolve('babel-loader'),
      },
    ],
  },

  resolve: {
    alias: {
      'react-abstract-autocomplete': path.join(__dirname, '../src/index.js'),
    },
  },

  devtool: 'source-map',

  devServer: {
    contentBase: dirname,
    publicPath: '/',
    historyApiFallback: true,
  },
});
