const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { name: libraryName, dependencies } = require('./package.json');

const sourceDirectory = 'src';
const destinationDirectory = 'dist';

const cjsExternals = {};
Object.keys(dependencies).forEach((name) => { cjsExternals[name] = name; });

module.exports = (env, argv) => {
  const { analyze, mode } = argv;
  const isProduction = mode === 'production';

  const commonConfig = {
    entry: './src/index',

    mode: isProduction ? 'production' : 'development',

    devtool: isProduction ? undefined : 'inline-source-map',

    plugins: [],

    externals: {},

    output: {
      path: path.resolve(__dirname, destinationDirectory),
      library: libraryName,
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

  return [
    {
      // UMD
      ...commonConfig,

      plugins: [
        ...commonConfig.plugins,
        ...(analyze ? [
          new BundleAnalyzerPlugin({
            analyzerPort: 3001,
          }),
        ] : []),
      ],

      output: {
        ...commonConfig.output,
        filename: `${libraryName}.umd.js`,
        libraryTarget: 'umd',
      },
    },
    {
      // CJS
      ...commonConfig,

      externals: {
        ...commonConfig.externals,
        ...cjsExternals,
      },

      output: {
        ...commonConfig.output,
        filename: `${libraryName}.cjs.js`,
        libraryTarget: 'commonjs2',
      },

      optimization: {
        ...commonConfig.optimization,
        minimize: false,
      },
    },
  ];
};
