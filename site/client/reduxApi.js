import get from 'get-value';
import {
  setErrorParams,
  addTranslations,
  addPageComponent,
  stopI18nFetching,
  stopCssFetching,
  stopPageFetching,
  addCssPageToCache,
} from './components/App/actions';
import { getI18nFileName } from './utils/helpers';
import * as constants from './components/App/constants';

const configureReduxApi = (store) => {
  return (type, ...args) => {
    const state = store.getState();
    const { cachedI18n } = state.App.i18n;
    const lang = state.App.route.params.language;

    switch (type) {
      case constants.ADD_PAGE_COMPONENT:
        store.dispatch(addPageComponent(...args));
        break;
      case constants.ADD_TRANSLATIONS:
        if (!get(cachedI18n, getI18nFileName(lang, args[2]))) {
          store.dispatch(addTranslations(...args));
        }
        break;
      case constants.ADD_APP_ERROR_PARAMS:
        store.dispatch(setErrorParams(...args));
        break;
      case constants.ADD_CSS_PAGE_TO_CACHE:
        store.dispatch(addCssPageToCache(...args));
        break;
      case constants.STOP_I18N_FETCHING:
        store.dispatch(stopI18nFetching(...args));
        break;
      case constants.STOP_PAGE_FETCHING:
        store.dispatch(stopPageFetching(...args));
        break;
      case constants.STOP_CSS_FETCHING:
        store.dispatch(stopCssFetching(...args));
        break;
      case 'getState':
        return state;
      default:
        console.log('unknown dispatch type');
        break;
    }
    return true;
  };
};

export default configureReduxApi;
