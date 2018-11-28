/* eslint-disable import/prefer-default-export */
import { matchPath } from 'react-router-dom';
import routes from '../client/components/App/routes';
import config from '../configs';

export const getMatchedRoute = (url) => {
  let route = null;
  routes.some((r) => {
    const match = matchPath(url, r);
    if (match && isAcceptedLang(match.params.language)) {
      route = r;
      route.params = match.params;
      route.currentUrl = url;
      return true;
    }
    return false;
  });
  return route;
};

export const isAcceptedLang = (lang) => {
  return config.acceptedLanguages.includes(lang);
};
