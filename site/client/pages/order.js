import OrderPage from '../components/pages/OrderPage';
import * as constants from '../components/App/constants';

if (typeof window.dispatch === 'undefined') {
  throw new Error('Not founded dispatch for Order page!');
}

window.dispatch(constants.ADD_PAGE_COMPONENT, 'order', OrderPage);
