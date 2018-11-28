import { compile } from 'path-to-regexp';

const routes = [
  {
    exact: true,
    path: '/:language',
    pageName: 'home',
  },
  {
    exact: true,
    path: '/:language/order',
    pageName: 'order',
  },
];

export function createUrlByName(routeName, routeParams) {
  try {
    return compile(routes.filter((route) => {
      return route.pageName === routeName;
    })[0].path)(routeParams);
  } catch (err) {
    return null;
  }
}

export default routes;
