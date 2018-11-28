const configs = require('./site/configs');

require('ignore-styles');
require('@babel/register')(configs.getBabelrcByBrowserQuery('defaults'));

module.exports = require('./site/server/server');
