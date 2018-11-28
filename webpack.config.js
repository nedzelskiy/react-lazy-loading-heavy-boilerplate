delete require.cache[require.resolve('./webpack.utils')];

const path = require('path');
const fse = require('fs-extra');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const client = require('./client');
const configs = require('./site/configs');
const webpackUtils = require('./webpack.utils');
const restartServer = require('./ops/scripts/restart-app');

const { WebpackOnBuildPlugin } = client.plugins;
const { recursiveFindFile } = require('./site/server/utils/helpers');

let manifest = {};

module.exports = {
  entry: client.entry,
  output: {
    path: path.resolve('site/static/js/'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
        commons: {
          chunks: 'initial',
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: Object.assign({}, configs.getBabelrcByBrowserQuery('defaults')),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoader: 2,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      'site/static/js/',
      'site/static/css/',
      'site/static/manifest.json',
    ], {}),
    new WebpackOnBuildPlugin({
      onEmit: (compilation, callback) => {
        manifest = webpackUtils.setChunksHashesToManifest(compilation, manifest);
        callback();
      },
      onFinish: () => {
        const files = recursiveFindFile('site/client/components', '.json', { parentDir: 'i18n' });
        manifest = webpackUtils.buildI18nFiles(files, manifest);
        fse.outputFileSync('site/static/manifest.json', JSON.stringify(manifest));
        restartServer();
      },
    }),
    new webpack.DefinePlugin(Object.keys(process.env).reduce((resObj, key) => {
      const obj = resObj;
      obj['process.env'] = {};
      obj[`process.env.${key}`] = process.env[key];
      return obj;
    }, {})),
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: '../../../logs/webpack-report.html',
    //   statsFilename: '../../../logs/webpack-stats.json',
    //   openAnalyzer: false,
    //   generateStatsFile: true,
    // }),
  ],
};
