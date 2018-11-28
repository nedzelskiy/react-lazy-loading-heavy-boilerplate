/* eslint-disable no-console, global-require */
import Router from 'router';
import { createServer } from 'http';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import finalHandler from './handlers/final';
import staticHandler from './handlers/static';
import defaultHandler from './handlers/default';
import applicationHandler from './handlers/application';
import { renderServerErrorPage, log } from './utils/serverUtils';

const router = Router();
const server = createServer();
const SERVER__DOMAIN = process.env.SERVER__DOMAIN || 'localhost';
const SERVER__PORT = process.env.SERVER__PORT || process.env.PORT;
const SERVER__URL = process.env.SERVER__URL || `${SERVER__DOMAIN}:${SERVER__PORT}`;

router.use(compression());
router.use(cookieParser());
router.use('/static*', staticHandler);
router.use('/', defaultHandler);
router.use('/:lang', applicationHandler);

let request = null;

process.on('uncaughtException', (err) => {
  log('uncaughtException', err);
  if (!request) {
    return null;
  }
  request.statusCode = 500;
  return request.end(renderServerErrorPage(request));
});
process.on('warning', (wrr) => {
  log('WRN', wrr.name);
  log(wrr.message);
  log(wrr.stack);
});

server.on('request', (req, res) => {
  request = req;
  return router(req, res, (err) => {
    finalHandler(err, req, res);
  });
}).listen(SERVER__PORT, SERVER__DOMAIN, () => {
  console.log(`Server is running on ${SERVER__URL} ${new Date()}`);
  if (!process.env.SERVER__START_CALLBACK) {
    return;
  }
  const { exec } = require('child_process');
  setTimeout(() => {
    exec(`node ${process.env.SERVER__START_CALLBACK}`, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }, 800);
});
