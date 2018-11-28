import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tsl from '../../Tsl';
import Navlink from '../../Navlink';
import './styles.scss';

class OrderPage extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
  };

  render() {
    return (
      <React.Fragment>
        <h2>
          <Tsl id="OrderPage" />
        </h2>
        <h3>
          <Tsl id="OrderPage unique text" />
        </h3>
        <div>
          <Navlink
            routeName="home"
            routeParams={{
              language: this.props.language,
            }}
          >
            <Tsl id="Go to" />
            &nbsp;
            <Tsl id="HomePage" />
          </Navlink>
        </div>
        <div>
          <Navlink to="/">
            <Tsl id="Go to" />
            { ' ' }
            /
          </Navlink>
        </div>
        <div>Uniqueorderpage</div>
      </React.Fragment>
    );
  }
}

export default connect((state) => {
  return {
    language: state.App.route.params.language,
  };
}, null)(OrderPage);
