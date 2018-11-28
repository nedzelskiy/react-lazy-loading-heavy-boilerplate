import HomePage from '../components/pages/HomePage';
import * as constants from '../components/App/constants';

if (typeof window.dispatch === 'undefined') {
  throw new Error('Not founded dispatch for Home page!');
}

window.dispatch(constants.ADD_PAGE_COMPONENT, 'home', HomePage);
