const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const { name: libraryName } = require('./package.json');

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
      new CleanWebpackPlugin(),
      new DeclarationBundlerPlugin({
        moduleName: `'${libraryName}'`,
        out: `${libraryName}.d.ts`,
      }),
      ...(analyze ? [
        new BundleAnalyzerPlugin({
          analyzerPort: 3001,
        }),
      ] : []),
    ],

    output: {
      path: path.resolve(__dirname, destinationDirectory),
      library: libraryName,
      filename: isProduction ? `${libraryName}.cjs.js` : `${libraryName}.umd.js`,
      libraryTarget: isProduction ? 'commonjs2' : 'umd',
    },

    optimization: {
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
          test: /\.worker\.[^.]+$/,
          use: {
            loader: 'worker-loader',
            options: {
              inline: true,
              fallback: false,
            },
          },
        },
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
