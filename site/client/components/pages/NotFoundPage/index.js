import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../ErrorPage';

export default class NotFoundPage extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
  };

  render() {
    return (
      <ErrorPage
        code={404}
        language={this.props.language}
        message="Not found"
      />
    );
  }
}
