/* eslint-disable prefer-destructuring */
import fs from 'fs';
import { getLanguage, getLangCookie } from '../utils/serverUtils';
import { createUrlByName } from '../../client/components/App/routes';

export default (req, res, next) => {
  let lang = getLangCookie(req);
  if (!lang) {
    lang = getLanguage(req);
  }
  switch (req.url) {
    case '/':
      res.writeHead(302, {
        Location: createUrlByName('home', { language: lang }),
      });
      res.statusCode = 302;
      return res.end();
    case '/favicon.ico':
      res.statusCode = 200;
      return res.end(fs.readFileSync('site/static/favicon.ico'));
    default:
      return next();
  }
};
