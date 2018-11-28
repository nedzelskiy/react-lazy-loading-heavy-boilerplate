/* eslint-disable no-param-reassign, global-require, no-nested-ternary, import/no-unresolved */
import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import config from '../../configs';
import App from '../../client/components/App';
import Html from '../../client/components/Html';
import { getLanguageFromHeaders } from './helpers';
import configureStore from '../../client/configureStore';
import {
  updateRoute,
  addPageComponent,
  addTranslations,
  setManifest,
  addCssPageToCache,
  addPagesI18nToCache,
  setErrorParams,
} from '../../client/components/App/actions';
import ErrorPage from '../../client/components/pages/ErrorPage';
import initialState from '../../client/components/App/initialState';
import { getMatchedRoute, isAcceptedLang } from '../../both/bothUtils';
import { capitaliseFirstLetter, getErrorRoute } from '../../both/helpers';

export const getTranslations = (lang, pageName) => {
  const translations = getPageTranslations(lang, pageName);
  const appTranslations = getAppTranslations(lang);
  if (!translations || !appTranslations) {
    log(new Error('Couldn\'t get translations!'));
    return null;
  }
  return Object.assign(appTranslations, translations);
};

const getPageTranslations = (lang, pageName) => {
  try {
    const componentName = `${capitaliseFirstLetter(pageName)}Page`;
    const iFileName = `${lang}.json`;
    return require(path.resolve(__dirname, `../../client/components/pages/${componentName}/i18n/${iFileName}`));
  } catch (err) {
    log(new Error(`Couldn't get page [${pageName}] translations!`));
    return null;
  }
};

const getAppTranslations = (lang) => {
  try {
    const iFileName = `${lang}.json`;
    return require(path.resolve(__dirname, `../../client/components/App/i18n/${iFileName}`));
  } catch (err) {
    log(new Error('Couldn\'t get app translations!'));
    return null;
  }
};

export const getPageComponent = (pageName) => {
  try {
    const wayToPages = path.resolve(__dirname, '../../client/components/pages');
    const pList = fs.readdirSync(wayToPages).filter((file) => {
      return !!file.toLowerCase().match(pageName.toLowerCase());
    });
    return pList.length < 1 ? null : require(path.resolve(wayToPages, pList[0])).default;
  } catch (err) {
    log(new Error(`Couldn't get page [${pageName}] component!`));
    return null;
  }
};


export const getLanguage = (req) => {
  const lang = req.params && req.params.lang ? req.params.lang : null;
  if (!lang) {
    return getCheckedLang(req, lang);
  }
  return lang;
};

export const getManifest = () => {
  try {
    return require('../../static/manifest');
  } catch (e) {
    log(new Error('Couldn\'t get manifest!'));
    return {};
  }
};

export const initStoreWithDispatch = (req, store, context) => {
  const lang = context.language ? context.language : getLanguage(req);
  const route = (context.pageName && context.pageName === 'error')
    ? getErrorRoute(req.originalUrl)
    : isAcceptedLang(lang)
      ? getRoute(req)
      : getErrorRoute(req.originalUrl);

  store.dispatch(updateRoute({
    pageName: route.pageName,
    prevUrl: req.originalUrl,
    currentUrl: req.originalUrl,
    path: route.path || req.originalUrl,
    params: route.params || {
      language: getCheckedLang(req, lang),
    },
  }));
  store.dispatch(setManifest(getManifest()));
  if (route.pageName !== 'error') {
    const translations = getTranslations(lang, route.pageName);
    store.dispatch(addPagesI18nToCache(lang, route.pageName));
    store.dispatch(addCssPageToCache(route.pageName));
    store.dispatch(addTranslations(lang, translations, route.pageName));
    store.dispatch(
      addPageComponent(
        route.pageName,
        renderComponent(req, getPageComponent(route.pageName), store),
      ),
    );
  } else {
    store.dispatch(setErrorParams(context.error));
  }
  return {
    route,
    context,
  };
};

export const getLangCookie = (req) => {
  if (
    req.cookies
    && req.cookies.lang
    && isAcceptedLang(req.cookies.lang)
  ) {
    return req.cookies.lang;
  }
  return null;
};

export const getCheckedLang = (req, language) => {
  let lang = language;
  if (!isAcceptedLang(lang)) {
    lang = getLangCookie(req);
    if (!lang) {
      lang = getLanguageFromHeaders(req.headers['accept-language'], config.acceptedLanguages);
      if (!lang) {
        lang = config.defaultLanguage;
      }
    }
  }
  return lang;
};

export const renderHtml = (req, context) => {
  const { store } = configureStore({});
  initStoreWithDispatch(req, store, context);
  return renderHtmlWithStore(req, store, context);
};

export const renderComponent = (req, Component, store) => {
  return ReactDOM.renderToStaticMarkup(
    <Provider store={store}>
      <StaticRouter location={req.originalUrl} context={{}}>
        <Component />
      </StaticRouter>
    </Provider>,
  );
};

export const renderServerErrorPage = (req) => {
  const lang = getLanguage(req);
  const store = {
    getState: () => {
      return {
        App: {
          ...initialState,
          route: {
            params: {
              language: lang,
            },
          },
          manifest: getManifest(),
        },
      };
    },
  };
  // TODO translate text
  return ReactDOM.renderToStaticMarkup(
    <Html store={store} isServerErrorPage={true}>
      <StaticRouter location={req.originalUrl}>
        <ErrorPage
          language={lang}
          code={500}
          message="Something went wrong!"
        />
      </StaticRouter>
    </Html>,
  );
};

export const renderHtmlWithStore = (req, store, context) => {
  return ReactDOM.renderToStaticMarkup(
    <Html store={store}>
      <Provider store={store}>
        <StaticRouter location={req.originalUrl} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </Html>,
  );
};

export const log = (err) => {
  if (
    !process.env.NODE_ENV
    || process.env.NODE_ENV !== 'production'
  ) {
    console.log(err);
  } else {
    console.log('!!!!!!!!!! log in production!');
    console.log(err);
  }
};

const getRoute = (req) => {
  const route = getMatchedRoute(req.originalUrl);
  if (!route) {
    return getErrorRoute(req.originalUrl);
  }
  return route;
};

export const throwError = (message, code, params) => {
  const error = new Error(message);
  error.code = code;
  error.params = params;
  log(error);
  throw error;
};
