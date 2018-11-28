import * as constants from './constants';

export const startI18nFetching = (language, pageName) => {
  return {
    type: constants.START_I18N_FETCHING,
    payload: { language, pageName },
  };
};

export const startCssFetching = (pageName) => {
  return {
    type: constants.START_CSS_FETCHING,
    payload: pageName,
  };
};

export const startPageFetching = (pageName) => {
  return {
    type: constants.START_PAGE_FETCHING,
    payload: pageName,
  };
};

export const setErrorParams = ({ code, message }) => {
  return {
    type: constants.ADD_APP_ERROR_PARAMS,
    payload: { code, message },
  };
};

export const clearErrorParams = () => {
  return {
    type: constants.CLEAR_APP_ERROR_PARAMS,
  };
};

export const addPageComponent = (pageName, pageContent) => {
  return {
    type: constants.ADD_PAGE_COMPONENT,
    payload: { pageName, pageContent },
  };
};

export const updateRoute = (route) => {
  return {
    type: constants.UPDATE_ROUT,
    payload: route,
  };
};

export const preloadPage = (route) => {
  return {
    type: constants.PRELOAD_PAGE,
    payload: route,
  };
};

export const setManifest = (manifest) => {
  return {
    type: constants.ADD_MANIFEST,
    payload: manifest,
  };
};

export const addTranslations = (lang, translations, pageName) => {
  return {
    type: constants.ADD_TRANSLATIONS,
    payload: { lang, translations, pageName },
  };
};

export const stopI18nFetching = (lang, pageName) => {
  return {
    type: constants.STOP_I18N_FETCHING,
    payload: { lang, pageName },
  };
};

export const stopCssFetching = (pageName) => {
  return {
    type: constants.STOP_CSS_FETCHING,
    payload: pageName,
  };
};

export const stopPageFetching = (pageName) => {
  return {
    type: constants.STOP_PAGE_FETCHING,
    payload: pageName,
  };
};

export const addPagesI18nToCache = (lang, pageName) => {
  return {
    type: constants.ADD_I18N_PAGE_TO_CACHE,
    payload: { lang, pageName },
  };
};

export const addCssPageToCache = (pageName) => {
  return {
    type: constants.ADD_CSS_PAGE_TO_CACHE,
    payload: pageName,
  };
};
