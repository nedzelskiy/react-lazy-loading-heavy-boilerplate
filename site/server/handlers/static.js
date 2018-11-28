import fs from 'fs';
import { getMimeType } from '../utils/helpers';
import { getLanguage, log } from '../utils/serverUtils';
import { createUrlByName } from '../../client/components/App/routes';

export default (req, res) => {
  const resourceName = req.params[0];
  const ext = resourceName.split('.').pop().toLowerCase();
  if (!resourceName || !ext || ext === '/') {
    const lang = getLanguage(req);
    res.writeHead(302, {
      Location: createUrlByName('home', { language: lang }),
    });
    res.statusCode = 302;
    return res.end();
  } try {
    res.setHeader('Content-Type', getMimeType(ext));
    res.setHeader('Cache-Control', `max-age=${60 * 60 * 24 * 31}`);
    res.statusCode = 200;
    return res.end(fs.readFileSync(`site/static${resourceName}`));
  } catch (e) {
    log(e);
    res.statusCode = 404;
    return res.end();
  }
};
