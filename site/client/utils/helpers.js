export function addQueryToUrl(url, query) {
  if (url && query) {
    return `${url}?${query}`;
  }
  return url;
}

export function getI18nFileName(lang, pageName) {
  return `${pageName}_${lang}`;
}

export function isThisIsBrowser() {
  return typeof window !== 'undefined';
}
