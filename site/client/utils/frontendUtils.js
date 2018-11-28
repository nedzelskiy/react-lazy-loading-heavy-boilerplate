/* eslint-disable no-param-reassign, no-multi-assign, prefer-destructuring */
import get from 'get-value';
import config from '../../configs';
import { getLangCookie } from './cookie';
import { isAcceptedLang } from '../../both/bothUtils';
import { getI18nFileName as gIFN } from './helpers';

export const getAdditionalContentInScript = (src, onSuccess = () => {}, onError = () => {}) => {
  const s = getScriptWithHandlers(
    document.createElement('script'),
    onSuccess,
    onError,
  );
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', src);
  document.body.appendChild(s);
  return s;
};

export const getAdditionalStylesInScript = (href, onSuccess = () => {}, onError = () => {}) => {
  const s = getScriptWithHandlers(
    document.createElement('link'),
    onSuccess,
    onError,
  );
  s.setAttribute('type', 'text/css');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('href', href);
  document.body.appendChild(s);
  return s;
};

export const getScriptWithHandlers = (script, onSuccess, onError) => {
  const checkCallback = () => {
    if (isScriptSuccess(script)) {
      onSuccess(script);
    } else {
      onError(script);
    }
  };

  script.onreadystatechange = function ors() {
    if (this.readyState === 'complete' || this.readyState === 'loaded') {
      script.onreadystatechange = null;
      setTimeout(checkCallback, 0);
    }
  };

  script.onload = script.onerror = checkCallback;

  return script;
};

const isScriptSuccess = (script) => {
  let isSuccess = false;
  switch (script.getAttribute('type')) {
    case 'text/css': {
      const fileNameWithQuery = script.getAttribute('href').split('?')[0].split('/').pop();
      const fileName = script.getAttribute('href').split('/').pop();
      Object.keys(document.styleSheets).forEach((styleSheetKey) => {
        const styleSheet = document.styleSheets[styleSheetKey];
        if (get(styleSheet, 'href')) {
          const cssFileName = styleSheet.href.split('/').pop();
          if (fileName === cssFileName || cssFileName === fileNameWithQuery) {
            try {
              if (typeof styleSheet.rules === 'undefined') {
                // firefox
                try {
                  if (styleSheet.cssRules.length > 0) {
                    isSuccess = true;
                  }
                } catch (err) {
                  isSuccess = false;
                }
              } else if (styleSheet.cssRules.length > 0) {
                // ie
                isSuccess = true;
              }
            } catch (e) {
              // chrome
              isSuccess = true;
            }
          }
        }
      });
      break;
    }

    case 'text/javascript':
    default: {
      const state = window.dispatch('getState');
      const src = script.getAttribute('src');
      const fileName = src.split('?')[0].split('/').pop().split('.')[0];
      if (src.indexOf('i18n') > -1) {
        // i18n
        const { cachedI18n } = state.App.i18n;
        if (get(cachedI18n, fileName)) {
          isSuccess = true;
        }
      } else {
        // js page
        const pages = state.App.pages;
        if (get(pages, fileName)) {
          isSuccess = true;
        }
      }
      break;
    }
  }
  return isSuccess;
};

export const setLangInHtmlTag = (lang) => {
  if (!get(setLangInHtmlTag, 'htmlTag')) {
    setLangInHtmlTag.htmlTag = document.getElementsByTagName('html')[0];
  }
  setLangInHtmlTag.htmlTag.setAttribute('lang', getCheckedLang(lang));
};

export const getCheckedLang = (language) => {
  let lang = language;
  if (!isAcceptedLang(lang)) {
    lang = getLangCookie();
    if (!lang) {
      lang = config.defaultLanguage;
    }
  }
  return lang;
};

export const checkIfNeedPage = (route, pages, pagesFetching) => {
  const { pageName } = route;
  return (
    !get(pages, pageName)
    && !get(pagesFetching, pageName)
  );
};

export const checkIfNeedCssForPage = (route, pages, cssFetching) => {
  const { pageName } = route;
  return (
    !get(pages, `cachedCss.${pageName}`)
    && !get(cssFetching, pageName)
  );
};

export const checkIfNeedI18nForPage = (route, i18n, i18nFetching) => {
  const { pageName } = route;
  const { language } = route.params;
  return (
    !get(i18n, `cachedI18n.${gIFN(language, pageName)}`)
    && !get(i18nFetching, gIFN(language, pageName))
  );
};
