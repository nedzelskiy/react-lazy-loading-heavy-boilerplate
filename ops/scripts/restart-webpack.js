'use strict';

const path = require('path');
const FILENAME = path.basename(__filename).replace(path.extname(path.basename(__filename)), '');

const CONSTANTS = {
  WEBPACK_RUNNER__PORT:  process.env.WEBPACK_RUNNER__PORT
};

for (let key in CONSTANTS) {
  if (!CONSTANTS[key]) {
    console.log(`${FILENAME}: You must set ${key} env!`);
    process.exit(1);
  }
}

const request = require('request');

const doRequest = () => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `http://localhost:${CONSTANTS.WEBPACK_RUNNER__PORT}`,
        headers: {'socket-control-command': 'restart-webpack'},
        proxy: ''
      },
      (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }
        if (response.statusCode !== 200) {
          reject({
            body: body,
            response: response
          });
          return;
        }
        resolve();
      }
    );
  })
    .catch(err => console.log(`${FILENAME}:`, err));
};

if (require.main === module) {
  doRequest();
} else {
  module.exports = doRequest;
}


