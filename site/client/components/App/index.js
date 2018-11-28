import React from 'react';
import get from 'get-value';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import config from '../../../configs';
import { updateRoute } from './actions';
import { createUrlByName } from './routes';
import ErrorPage from '../pages/ErrorPage';
import PageLoader from '../loaders/PageLoader';
import NotFoundPage from '../pages/NotFoundPage';
import { isThisIsBrowser } from '../../utils/helpers';
import { getErrorRoute } from '../../../both/helpers';
import { getMatchedRoute } from '../../../both/bothUtils';
import './styles.scss';

class App extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    matchedRoute: PropTypes.object,
    route: PropTypes.object.isRequired,
    pages: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    updateRoute: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: undefined,
    matchedRoute: null,
  };

  static updateRoute(updateFunc, props) {
    const newRouterState = {
      pageName: props.matchedRoute.pageName,
      prevUrl: props.route.prevUrl,
      currentUrl: props.history.location.pathname,
      path: props.matchedRoute.path,
      params: props.matchedRoute.params,
    };
    if (!isEqual(newRouterState, props.route)) {
      newRouterState.prevUrl = props.route.currentUrl;
      updateFunc(newRouterState);
    }
  }

  static getErrorRoute(props) {
    return {
      ...getErrorRoute(props.location.pathname),
      prevUrl: props.route.currentUrl,
      params: props.route.params,
    };
  }

  static isWeAlreadyHaveThisPage(props) {
    return !!get(props.pages, props.matchedRoute.pageName);
  }

  static statePageNameIdTimeout = null;

  constructor() {
    super();
    this.state = {
      pageName: null,
    };
  }

  componentWillMount() {
    this.updateCurrentRoute(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isThisIsBrowser()) {
      return;
    }
    this.updateCurrentRoute(nextProps);
    if (nextProps.matchedRoute && App.isWeAlreadyHaveThisPage(nextProps)) {
      this.setState({
        pageName: nextProps.matchedRoute.pageName,
      }, () => {
        if (App.statePageNameIdTimeout) {
          return;
        }
        App.statePageNameIdTimeout = setTimeout(() => {
          this.setState({
            pageName: null,
          }, () => {
            App.statePageNameIdTimeout = null;
          });
        }, config.startLoadingPageTimeout);
      });
    }
  }

  updateCurrentRoute(props) {
    if (props.matchedRoute) {
      App.updateRoute(this.props.updateRoute, props);
    } else {
      App.updateRoute(this.props.updateRoute, {
        ...props,
        matchedRoute: App.getErrorRoute(props),
      });
    }
  }

  renderComponent(Component, pageName) {
    if (typeof Component === 'string') {
      return (
        <div dangerouslySetInnerHTML={{ __html: Component }} />
      );
    }
    return (
      <div className={`${pageName}-page`}>
        <Component />
      </div>
    );
  }

  renderComponentFromCache() {
    const { pageName } = this.props.matchedRoute;
    const Component = get(this.props.pages, pageName);
    if (Component) {
      return this.renderComponent(Component, pageName);
    }
    return null;
  }

  renderStateComponent() {
    const Component = get(this.props.pages, this.state.pageName);
    return this.renderComponent(Component, this.state.pageName);
  }

  renderNotFound() {
    return (
      <NotFoundPage
        language={this.props.language}
      />
    );
  }

  renderErrorPage() {
    if (this.props.error.code === 404) {
      return this.renderNotFound();
    }
    if (
      this.props.error.code
      && this.props.error.message
    ) {
      return (
        <ErrorPage
          code={this.props.error.code}
          language={this.props.language}
          message={this.props.error.message}
        />
      );
    }
    return this.renderNotFound();
  }

  renderContent() {
    if (!this.props.matchedRoute) {
      if (this.props.location.pathname === '/') {
        return (
          <Redirect
            key="home"
            to={createUrlByName('home', { ...this.props })}
          />
        );
      }
      return this.renderErrorPage();
    }
    if (App.isWeAlreadyHaveThisPage(this.props)) {
      return this.renderComponentFromCache();
    }
    if (this.state.pageName) {
      return this.renderStateComponent();
    }
    if (this.props.error.code) {
      return this.renderErrorPage();
    }
    return <PageLoader />;
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        { this.renderContent() }
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(connect((state, ownProps) => {
  return {
    route: state.App.route,
    pages: state.App.pages,
    error: state.App.error,
    language: state.App.route.params.language,
    matchedRoute: getMatchedRoute(ownProps.location.pathname),
  };
}, {
  updateRoute,
})(App));
