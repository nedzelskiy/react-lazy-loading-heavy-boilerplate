/* eslint-disable react/no-danger */
import React from 'react';
import get from 'get-value';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';
import { getI18nFileName } from '../../utils/helpers';

export default class Html extends React.PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isServerErrorPage: PropTypes.bool,
  };

  static defaultProps = {
    isServerErrorPage: false,
  };

  renderPageFiles() {
    const state = this.props.store.getState();
    const m = state.App.manifest || {};
    const { pageName } = state.App.route;
    const lang = state.App.route.params.language;
    if (pageName !== 'error') {
      const i18Hash = get(m, `i18n.${getI18nFileName(lang, pageName)}`);
      return (
        <React.Fragment>
          <link
            rel="stylesheet"
            type="text/css"
            href={`/static/css/pages/${pageName}.css?${get(m, `${pageName}.css`)}`}
          />
          <script type="text/javascript" src={`/static/js/i18n/${getI18nFileName(lang, pageName)}.js?${i18Hash}`} />
          <script type="text/javascript" src={`/static/js/pages/${pageName}.js?${get(m, `${pageName}.js`)}`} />
        </React.Fragment>
      );
    }
    return null;
  }

  renderCoreFiles() {
    if (!this.props.isServerErrorPage) {
      const state = this.props.store.getState();
      const m = state.App.manifest || {};
      return (
        <React.Fragment>
          <script id="state" dangerouslySetInnerHTML={{ __html: `window.state=${serialize(state)};` }} />
          <script type="text/javascript" src={`/static/js/common.js?${get(m, 'common.js')}`} />
          <script type="text/javascript" src={`/static/js/vendors.js?${get(m, 'vendors.js')}`} />
          <script type="text/javascript" src={`/static/js/app.js?${get(m, 'app.js')}`} />
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const state = this.props.store.getState();
    const m = state.App.manifest || {};
    const lang = state.App.route.params.language;
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" type="text/css" href={`/static/css/app.css?${get(m, 'app.css')}`} />
          <title />
        </head>
        <body>
          <div id="app">{ this.props.children }</div>
          { this.renderCoreFiles() }
          { this.renderPageFiles() }
        </body>
      </html>
    );
  }
}
