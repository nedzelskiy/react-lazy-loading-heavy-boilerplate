/* eslint-disable no-multi-assign */
import configureStore from '../../client/configureStore';
import {
  renderHtmlWithStore,
  initStoreWithDispatch,
  getLanguage,
} from '../utils/serverUtils';

export default (err, req, res) => {
  if (err) {
    const params = {
      language: err.params && err.params.lang
        ? err.params.lang
        : getLanguage(req),
      pageName: 'error',
      error: {
        message: err.message,
      },
    };
    switch (err.code) {
      case 'ENOENT':
      case 'EISDIR':
      case '404':
      case 404:
        params.error.code = res.statusCode = 404;
        break;
      default:
        params.error.code = res.statusCode = 500;
    }
    const { store } = configureStore({});
    const { context } = initStoreWithDispatch(req, store, params);
    const html = renderHtmlWithStore(req, store, context);
    res.statusCode = 200;
    return res.end(html);
  }
  res.statusCode = 500;
  return res.end('route can\'t be managed!');
};
