/* eslint-disable import/prefer-default-export */
export const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

export const getErrorRoute = (url) => {
  return {
    pageName: 'error',
    currentUrl: url,
    path: url,
    matchedUrl: null,
  };
};
