const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const sourceDirectory = 'src';
const destinationDirectory = 'dist';

module.exports = (env, argv) => {
  const { analyze, mode } = argv;
  const isProduction = mode === 'production';

  return {
    entry: './src/index',

    mode: isProduction ? 'production' : 'development',

    devtool: isProduction ? undefined : 'inline-source-map',

    plugins: [
      ...(analyze ? [
        new BundleAnalyzerPlugin({
          analyzerPort: 3001,
        }),
      ] : []),
    ],

    output: {
      path: path.resolve(__dirname, destinationDirectory),
      filename: 'lib.js',
      publicPath: '/',
      library: 'mtproto-js',
      libraryTarget: 'umd',
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          // sourceMap: true, // For source maps in production (may be required depending on the contest rules)
          extractComments: false,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        {
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader',
            options: {
              inline: true,
              fallback: false,
            },
          },
        },
      ],
    },

    resolve: {
      modules: [sourceDirectory, 'node_modules'],
      extensions: ['.js', '.ts'],
    },

    node: {
      fs: 'empty',
    },
  };
};
