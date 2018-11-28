/* eslint-disable no-param-reassign */
const cloneDeep = require('lodash/cloneDeep');

const babelrc = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'defaults',
        },
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
  ],
};

function getBabelrcByBrowserQuery(browserQuery) {
  const result = cloneDeep(babelrc);
  result.presets[0][1].targets.browsers = browserQuery;
  return result;
}
module.exports = {
  defaultLanguage: 'ru',
  acceptedLanguages: ['ru', 'en', 'ua'],
  startLoadingPageTimeout: 1700,
  pageLoadingTimeout: 1000 * 60,
  getBabelrcByBrowserQuery,
};
