/*
 * This is a config file for watcher and runner microservice built on fs-watcher lib
 * Here you can define folders and files that will be watched and define a callbacks
 * that will be run if in those folders or files change smth
 *
 * Example structure for options see more for 'node-watch' npm package manual
 *
        options[<serve url>] = {
            options: {             // optionally = options for node-watch
                persistent: <Boolean> default = true
                recursive: <Boolean> default = true
                encoding: <String> default = 'utf8'
            },
            callbacks: {
                update: () => {}, // included create and change events
                remove: () => {}
            },
            runImmediately: () => {},       // optionally task will be run Immediately
            filter: (fullNamePath) => {},   // optionally filter watching files
        };

        module.exports = options;
 *
 * You can build this file with any rules and also without process env variables
*/

const path = require('path');

const FILENAME = path.basename(__filename).replace(path.extname(path.basename(__filename)), '');

const CONSTANTS = {
  SERVER__SRC_FOLDER: process.env.SERVER__SRC_FOLDER,
};

CONSTANTS.SERVER__SRC_FOLDER = path.normalize(CONSTANTS.SERVER__SRC_FOLDER);

for (const key in CONSTANTS) {
  if (!CONSTANTS[key]) {
    console.log(`${FILENAME}: You must set ${key} env!`);
    process.exit(1);
  }
}

const options = {};
const utils = require('./utils');


const localConfigs = {
  sendConsoleText: utils.sendConsoleText,
  logInfo: () => {
  },
};

const restartServer = require('./restart-app');
const restartWebpack = require('./restart-webpack');

options[`${process.env.PWD}/${CONSTANTS.SERVER__SRC_FOLDER}/server/`] = {
  callbacks: {
    update: restartServer,
    remove: (fileName) => {
      console.log('remove', fileName);
      restartServer();
    },
  },
  runImmediately: () => {},
};

options[`${process.env.PWD}/${CONSTANTS.SERVER__SRC_FOLDER}/client/components/Html/`] = {
  callbacks: {
    update: restartServer,
    remove: (fileName) => {
      console.log('remove', fileName);
      restartServer();
    },
  },
  runImmediately: () => {},
};

options[`${process.env.PWD}/${CONSTANTS.SERVER__SRC_FOLDER}/client/`] = {
  callbacks: {
    update: (fileName) => {
      const ext = fileName.split('.').pop();
      if (!!~fileName.indexOf('i18n') && ext.toLowerCase() === 'json') {
        restartWebpack();
      }
    },
    remove: (fileName) => {
      const ext = fileName.split('.').pop();
      if (!!~fileName.indexOf('i18n') && ext.toLowerCase() === 'json') {
        restartWebpack();
      }
    },
  },
  runImmediately: () => {},
};

options[`${process.env.PWD}/`] = {
  options: {
    recursive: false,
  },
  callbacks: {
    update: () => {
      restartWebpack();
    },
    remove: (fileName) => {
      console.log('remove', fileName);
      restartWebpack();
    },
  },
  runImmediately: () => {},
  filter: (fullNamePath) => {
    const fileName = fullNamePath.split(path.sep).pop().toLowerCase();
    const ext = fullNamePath.split('.').pop().toLowerCase();
    if (fileName[0] === '.') {
      return false;
    }
    return true;
  },
};


module.exports = {
  options,
  localConfigs,
};
