import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Tsl extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    i18n: PropTypes.object.isRequired,
  };

  translate() {
    const { id, i18n } = this.props;
    if (!i18n[id]) {
      return id;
    }
    return i18n[id];
  }

  render() {
    return (
      <React.Fragment>{this.translate()}</React.Fragment>
    );
  }
}

export default connect((state) => {
  const { i18n, route } = state.App;
  const { language } = route.params;
  return {
    i18n: i18n[language] ? i18n[language] : {},
  };
}, null)(Tsl);
