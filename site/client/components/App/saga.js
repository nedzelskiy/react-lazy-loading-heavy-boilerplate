import get from 'get-value';
import {
  put, call, select, takeEvery,
} from 'redux-saga/effects';
import {
  startI18nFetching,
  startPageFetching,
  stopI18nFetching,
  addPagesI18nToCache,
  startCssFetching,
  stopPageFetching,
} from './actions';
import * as constants from './constants';
import { setLangCookie, getLangCookie } from '../../utils/cookie';
import { getI18nFileName as gIFN, isThisIsBrowser } from '../../utils/helpers';
import {
  setLangInHtmlTag,
  getAdditionalContentInScript as gACIS,
  getAdditionalStylesInScript as gASIS,
} from '../../utils/frontendUtils';
import config from '../../../configs';

function* addTranslationsWithAdditionalActions(action) {
  const { lang, pageName } = action.payload;
  yield put(stopI18nFetching(lang, pageName));
  yield put(addPagesI18nToCache(lang, pageName));
}

function* addPageComponentWithAdditionalActions(action) {
  const state = yield select((s) => {
    return s;
  });
  const { pageName } = action.payload;
  if (Object.keys(state.App.pagesFetching).length > 0) {
    yield put(stopPageFetching(pageName));
  }
}

const loadersTimeouts = {};

function* fetchI18n(route) {
  const state = yield select((s) => {
    return s;
  });
  const { manifest } = state.App;
  const { pageName } = route;
  const { language } = route.params;
  if (
    !get(state.App, `i18n.cachedI18n.${gIFN(language, pageName)}`)
    && !get(state.App, `i18nFetching.${gIFN(language, pageName)}`)
  ) {
    const i18nHash = get(manifest, `i18n.${gIFN(language, pageName)}`);
    yield put(startI18nFetching(language, pageName));
    yield call(gACIS, `/static/js/i18n/${gIFN(language, pageName)}.js?${i18nHash}`,
      undefined,
      (script) => {
        document.body.removeChild(script);
        window.dispatch(constants.STOP_I18N_FETCHING, language, pageName);
      });
  }
}

function* fetchCss(route) {
  const state = yield select((s) => {
    return s;
  });
  const { manifest } = state.App;
  const { pageName } = route;
  if (
    !get(state.App, `pages.cachedCss.${pageName}`)
    && !get(state.App, `cssFetching.${pageName}`)
  ) {
    yield put(startCssFetching(pageName));
    yield call(gASIS,
      `/static/css/pages/${pageName}.css?${get(manifest, `${pageName}.css`)}`,
      () => {
        window.dispatch(constants.STOP_CSS_FETCHING, pageName);
        window.dispatch(constants.ADD_CSS_PAGE_TO_CACHE, pageName);
      },
      (script) => {
        document.body.removeChild(script);
        window.dispatch(constants.STOP_CSS_FETCHING, pageName);
      });
  }
}

function* fetchPage(route) {
  const state = yield select((s) => {
    return s;
  });
  const { manifest } = state.App;
  const { pageName } = route;
  if (
    !get(state.App, `pages.${pageName}`)
    && !get(state.App, `pagesFetching.${pageName}`)
  ) {
    const deleteLoaderTimeout = () => {
      if (get(loadersTimeouts, pageName)) {
        clearTimeout(loadersTimeouts[pageName]);
        delete loadersTimeouts[pageName];
      }
    };
    const requestPageTimeoutError = (script) => {
      deleteLoaderTimeout();
      document.body.removeChild(script);
      window.dispatch(constants.STOP_PAGE_FETCHING, pageName);
      if (document.location.pathname === route.currentUrl) {
        window.dispatch(constants.ADD_APP_ERROR_PARAMS, { code: 408, message: 'Request Timeout' });
      }
    };

    yield put(startPageFetching(pageName));
    const s = yield call(gACIS,
      `/static/js/pages/${pageName}.js?${get(manifest, `${pageName}.js`)}`,
      () => {
        deleteLoaderTimeout();
      },
      requestPageTimeoutError);
    if (!get(loadersTimeouts, pageName)) {
      loadersTimeouts[pageName] = setTimeout(() => {
        deleteLoaderTimeout();
        requestPageTimeoutError(s);
      }, config.pageLoadingTimeout);
    }
  }
}

function* updateParamsInState(action) {
  const state = yield select((s) => {
    return s;
  });
  const { route } = state.App;
  const { pageName, params } = action.payload;
  const { language } = params;
  yield call(setLangInHtmlTag, language);
  if (getLangCookie() !== language) {
    yield call(setLangCookie, language);
  }
  if (pageName === 'error') {
    return;
  }
  yield* fetchI18n(route);
  yield* fetchCss(route);
  yield* fetchPage(route);
}

function* preloadPage(action) {
  const route = action.payload;
  if (!route) {
    return;
  }
  yield* fetchI18n(route);
  yield* fetchCss(route);
  yield* fetchPage(route);
}

function* watchAddTranslations() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.ADD_TRANSLATIONS, addTranslationsWithAdditionalActions);
  }
}

function* watchAddPageComponent() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.ADD_PAGE_COMPONENT, addPageComponentWithAdditionalActions);
  }
}

function* watchRouteChanged() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.UPDATE_ROUT, updateParamsInState);
  }
}

function* watchPreloadPage() {
  if (isThisIsBrowser()) {
    yield takeEvery(constants.PRELOAD_PAGE, preloadPage);
  }
}

export default [
  watchRouteChanged(),
  watchAddTranslations(),
  watchAddPageComponent(),
  watchPreloadPage(),
];
