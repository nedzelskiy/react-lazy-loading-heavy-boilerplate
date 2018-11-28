import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navlink from '../../Navlink/index';
import { createUrlByName } from '../../App/routes';
import { clearErrorParams } from '../../App/actions';
import './styles.scss';

class ErrorPage extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
    code: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    clearErrorParams: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.clearErrorParams();
  }

  render() {
    return (
      <div>
        <h1>Error page</h1>
        <div>{ this.props.code }</div>
        <div>{ this.props.message }</div>
        <Navlink
          to={createUrlByName('home', {
            language: this.props.language,
          })}
        >
          Go to Main
        </Navlink>
      </div>
    );
  }
}

export default connect(null, {
  clearErrorParams,
})(ErrorPage);
