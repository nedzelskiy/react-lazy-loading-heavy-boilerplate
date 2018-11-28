import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createUrlByName } from '../App/routes';
import { addQueryToUrl } from '../../utils/helpers';
import {
  checkIfNeedPage,
  checkIfNeedCssForPage,
  checkIfNeedI18nForPage,
} from '../../utils/frontendUtils';
import {
  preloadPage,
} from '../App/actions';
import { getMatchedRoute } from '../../../both/bothUtils';

class Navlink extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    style: PropTypes.object,
    query: PropTypes.string,
    children: PropTypes.any,
    replace: PropTypes.bool,
    preload: PropTypes.bool,
    title: PropTypes.string,
    routeName: PropTypes.string,
    isNewWindow: PropTypes.bool,
    className: PropTypes.string,
    openInNewTab: PropTypes.bool,
    routeParams: PropTypes.object,
    redux: PropTypes.object.isRequired,
  };

  static defaultProps = {
    to: null,
    style: {},
    query: null,
    title: null,
    className: '',
    children: null,
    preload: false,
    replace: false,
    routeName: null,
    routeParams: {},
    isNewWindow: false,
    openInNewTab: false,
  };

  constructor(props) {
    super(props);
    this.onMouseOverHandler = ::this.onMouseOverHandler;
  }

  getNavLinkProps() {
    const props = {
      ...this.props,
      target: this.getLinkTarget(),
      to: this.getLinkUrl(),
    };
    delete props.redux;
    delete props.preload;
    delete props.routeName;
    delete props.routeParams;
    delete props.preloadPage;
    delete props.isNewWindow;
    delete props.openInNewTab;
    return props;
  }

  getLinkUrl() {
    if (this.props.to) {
      return addQueryToUrl(this.props.to, this.props.query);
    }

    let url;

    if (this.props.routeName) {
      url = createUrlByName(this.props.routeName, this.props.routeParams);
    }

    return addQueryToUrl(url, this.props.query);
  }

  onFocusHandler() {
    return null;
  }

  onMouseOverHandler(e) {
    if (
      this.props.onMouseOver
      && typeof this.props.onMouseOver === 'function'
    ) {
      this.props.onMouseOver(e);
    }
    if (this.props.preload) {
      const url = this.getLinkUrl();
      const route = getMatchedRoute(url);
      if (!route) {
        return;
      }
      const {
        i18nFetching, pagesFetching, cssFetching, i18n, pages,
      } = this.props.redux;
      if (
        checkIfNeedI18nForPage(route, i18n, i18nFetching)
        || checkIfNeedCssForPage(route, pages, cssFetching)
        || checkIfNeedPage(route, pages, pagesFetching)
      ) {
        this.props.preloadPage(route, url);
      }
    }
  }

  getLinkTarget() {
    return this.props.isNewWindow || this.props.openInNewTab ? '_blank' : '';
  }

  render() {
    const linkProps = this.getNavLinkProps();
    return (
      <Link
        {...linkProps}
        onFocus={this.onFocusHandler}
        onMouseOver={this.onMouseOverHandler}
      >
        {this.props.children}
      </Link>
    );
  }
}

export default connect((state) => {
  return {
    redux: {
      i18nFetching: state.App.i18nFetching,
      pagesFetching: state.App.pagesFetching,
      cssFetching: state.App.cssFetching,
      pages: state.App.pages,
      i18n: state.App.i18n,
    },
  };
}, {
  preloadPage,
})(Navlink);
