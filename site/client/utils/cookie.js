import Cookies from 'js-cookie';

export function read(key) {
  if (typeof document !== 'undefined') {
    return Cookies.get(key);
  }
  return null;
}

export function set(name, value, domain = '', hours, path = '/') {
  if (typeof document !== 'undefined') {
    const options = { path, domain };
    if (hours) {
      options.expires = hours / 24;
    }
    Cookies.set(name, value, options);
  }
  return null;
}

export function remove(name, domain) {
  if (typeof document !== 'undefined') {
    const removeOptions = {};
    if (domain) {
      removeOptions.domain = domain;
    }
    Cookies.remove(name, removeOptions);
  }
  return null;
}

export function setLangCookie(value) {
  set('lang', value, '', 24 * 3);
}

export function getLangCookie() {
  return read('lang');
}
