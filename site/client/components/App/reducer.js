import get from 'get-value';
import cloneDeep from 'lodash/cloneDeep';
import * as constants from './constants';
import initialState from './initialState';
import { getI18nFileName as gIFN } from '../../utils/helpers';

export default function (state = initialState, action) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case constants.UPDATE_ROUT:
      newState.route = {
        ...initialState.route,
        ...action.payload,
      };
      break;

    case constants.START_I18N_FETCHING: {
      const { language, pageName } = action.payload;
      newState.i18nFetching[gIFN(language, pageName)] = new Date().getTime();
      break;
    }

    case constants.CLEAR_APP_ERROR_PARAMS:
      newState.error.message = initialState.error.message;
      newState.error.code = initialState.error.code;
      break;

    case constants.ADD_APP_ERROR_PARAMS: {
      const { message, code } = action.payload;
      newState.error.message = message;
      newState.error.code = code;
      break;
    }

    case constants.START_PAGE_FETCHING:
      newState.pagesFetching[action.payload] = new Date().getTime();
      break;

    case constants.START_CSS_FETCHING:
      newState.cssFetching[action.payload] = new Date().getTime();
      break;

    case constants.STOP_PAGE_FETCHING:
      delete newState.pagesFetching[action.payload];
      break;

    case constants.STOP_CSS_FETCHING:
      delete newState.cssFetching[action.payload];
      break;

    case constants.ADD_MANIFEST:
      newState.manifest = action.payload;
      break;

    case constants.ADD_PAGE_COMPONENT: {
      const { pageContent, pageName } = action.payload;
      if (!get(newState, `pages.${pageName}`)) {
        newState.pages[`${pageName}`] = {};
      }
      newState.pages[`${pageName}`] = pageContent;
      break;
    }

    case constants.ADD_TRANSLATIONS: {
      const { lang, translations } = action.payload;
      if (!get(newState, `i18n.${lang}`)) {
        newState.i18n[lang] = {};
      }
      newState.i18n[lang] = Object.assign(newState.i18n[lang], translations);
      break;
    }

    case constants.ADD_I18N_PAGE_TO_CACHE: {
      const { lang, pageName } = action.payload;
      const cachedI18nKey = `${gIFN(lang, pageName)}`;
      if (!get(newState, `i18n.cachedI18n.${cachedI18nKey}`)) {
        newState.i18n.cachedI18n[cachedI18nKey] = {};
      }
      newState.i18n.cachedI18n[cachedI18nKey] = new Date().getTime();
      break;
    }

    case constants.ADD_CSS_PAGE_TO_CACHE: {
      const pageName = action.payload;
      if (!get(newState, `pages.cachedCss.${pageName}`)) {
        newState.pages.cachedCss[pageName] = {};
      }
      newState.pages.cachedCss[pageName] = new Date().getTime();
      break;
    }

    case constants.STOP_I18N_FETCHING: {
      const { lang, pageName } = action.payload;
      delete newState.i18nFetching[gIFN(lang, pageName)];
      break;
    }

    default:
      break;
  }

  return newState;
}
