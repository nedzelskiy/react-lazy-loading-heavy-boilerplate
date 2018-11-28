import { getMatchedRoute } from '../../both/bothUtils';
import { renderHtml, throwError } from '../utils/serverUtils';

export default (req, res) => {
  if (!getMatchedRoute(req.originalUrl)) {
    throwError(
      `Route "${req.originalUrl}" not found!`,
      'ENOENT',
      req.params,
    );
    return null;
  }
  const context = {};
  const html = renderHtml(req, context);
  if (!context.url) {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    return res.end(html);
  }
  res.writeHead(302, {
    Location: context.url,
  });
  res.statusCode = 302;
  return res.end();
};
