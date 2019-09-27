const path = require('path');

module.exports = {
  mode: 'production',

  entry: './src/index',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js', 
    publicPath: '/', 
    library: 'mtproto-js', 
    libraryTarget: 'umd', 
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      'node_modules'
    ],
    extensions: ['.js'],
  },
}