const fs = require('fs');
const path = require('path');

class WebpackOnBuildPlugin {
  constructor(options) {
    this.onFinish = options.onFinish;
    this.onStart = options.onStart;
    this.onEmit = options.onEmit;
  }

  apply(compiler) {
    compiler.plugin('done', this.onFinish ? this.onFinish : () => {});
    compiler.plugin('compilation', this.onStart ? this.onStart : () => {});
    compiler.plugin('emit', this.onEmit ? this.onEmit : (compilation, callback) => { return callback(); });
  }
}

const entryBuilder = (wayToFiles, entryPrefix = '') => {
  const entriesList = {};
  fs.readdirSync(wayToFiles).reduce((list, dirName) => {
    const pageName = dirName.split('.')[0];
    if (!list[pageName]) {
      list[`${entryPrefix}${pageName}`] = path.resolve(wayToFiles, dirName);
    }
    return list;
  }, entriesList);
  return entriesList;
};

const pagesList = entryBuilder(
  path.resolve(__dirname, 'site/client/pages/'),
  'pages/',
);


module.exports = {
  entry: {
    app: path.resolve(__dirname, 'site/client/client/'),
    ...pagesList,
  },
  plugins: {
    WebpackOnBuildPlugin,
  },
};
