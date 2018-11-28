'use strict';

const path = require('path');
const FILENAME = path.basename(__filename).replace(path.extname(path.basename(__filename)), '');

const CONSTANTS = {
  WEBPACK_RUNNER__PORT:             process.env.WEBPACK_RUNNER__PORT,
  WEBPACK_RUNNER__WAY_TO_COMPILER:  process.env.WEBPACK_RUNNER__WAY_TO_COMPILER,
  WEBPACK_RUNNER__COLOR:            process.env.WEBPACK_RUNNER__COLOR || 'yellow',
};

for (let key in CONSTANTS) {
  if (!CONSTANTS[key]) {
    console.log(`${FILENAME}: You must set ${key} env!`);
    process.exit(1);
  }
}

let compiler =  null;

const types = {};
const http = require('http');
const server = http.createServer();
const util = require('./microservices-utils');
const ctx = {
  'name': FILENAME,
  'color': CONSTANTS.WEBPACK_RUNNER__COLOR,
  'port': CONSTANTS.WEBPACK_RUNNER__PORT,
  'types': types,
  'process': process
};
const io = require('socket.io')(server);
const sendConsoleText = util.sendConsoleText.bind(ctx);

const getCompiler = () => {
  try {
    const w = `${process.env.PWD}/${CONSTANTS.WEBPACK_RUNNER__WAY_TO_COMPILER}`;
    delete require.cache[require.resolve(w)];
    compiler = require(w);
    return compiler;
  } catch(err) {
    sendConsoleText(`Some problems with microservice compiler file! ${err}`, 'err');
    process.exit(1);
  }
};

server.on('request', util.httpServerHandler.bind(ctx));
server.listen(CONSTANTS.WEBPACK_RUNNER__PORT);

io.on('connection', (socket) => {
  socket.on('message', (message, cb) => {
    types[message.type] &&
    types[message.type]()
      .then(() => {
        cb && ('function' === typeof cb) && cb();
      })
      .catch((err) => sendConsoleText(err, 'error'));
  });
});

sendConsoleText(`started on ${CONSTANTS.WEBPACK_RUNNER__PORT}`);

const startWebpack = () => {
  return new Promise((resolve, reject) => {
    const webpackProcess = getCompiler().watch({
        aggregateTimeout: 300,
      },
      (err, stats) => {
        if (err) {
          sendConsoleText(err.stack || err, 'error');
          if (err.details) {
            sendConsoleText(err.details, 'error');
          }
          reject();
          return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          sendConsoleText(info.errors.join('\n\n'), 'warn');
        }

        if (stats.hasWarnings()) {
          sendConsoleText(info.warnings.join('\n\n'), 'warn');
        }

        sendConsoleText(stats.toString({
          minimal: true,
          assets: false,
          chunks: false,
          children: false,
          modules: false,
          colors: true
        }));

        resolve(webpackProcess);
      }
    );
  });
};

types['restart-webpack'] = () => {
  if (types['restart-webpack'].webpackProcess) {
    const webpackProcess = types['restart-webpack'].webpackProcess;
    types['restart-webpack'].webpackProcess = null;
    types['restart-webpack'].promise = new Promise((resolve, reject) => {
      webpackProcess.close(() => {
        sendConsoleText('Webpack process closed!');
        types['restart-webpack'].promise = null;
        resolve(types['restart-webpack']());
      });
    });
  }
  if (!types['restart-webpack'].promise && !types['restart-webpack'].webpackProcess) {
    types['restart-webpack'].promise = startWebpack().then((webpackProcess) => {
      types['restart-webpack'].webpackProcess = webpackProcess;
    });
  }
  return types['restart-webpack'].promise;
};

types['get-commands'] = () => {
  return Promise.resolve(Object.keys(types).filter(command => command !== 'get-commands'));
};

types['restart-webpack']();
