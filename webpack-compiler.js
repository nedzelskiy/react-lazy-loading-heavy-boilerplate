const SERVER__SRC = process.env.SERVER__SRC_FOLDER;
const configs = require(`./${SERVER__SRC}/configs`);

require('@babel/register')(configs.getBabelrcByBrowserQuery('defaults'));

delete require.cache[require.resolve('./webpack.config')];
const webpack = require('webpack');
const config = require('./webpack.config');

config.mode = 'development';

if (config.mode === 'production') {
  config.performance = {};
  config.performance.hints = false;
}

module.exports = webpack(config);
