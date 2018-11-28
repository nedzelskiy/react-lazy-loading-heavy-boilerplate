import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tsl from '../../Tsl';
import Navlink from '../../Navlink';
import './styles.scss';

class HomePage extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
  };

  render() {
    return (
      <React.Fragment>
        <h2>
          <Tsl id="HomePage" />
        </h2>
        <h3>
          <Tsl id="HomePage unique text" />
        </h3>
        <div>
          <Navlink
            routeName="order"
            preload={true}
            routeParams={{
              language: this.props.language,
            }}
          >
            <Tsl id="Go to" />
            <Tsl id="OrderPage" />
          </Navlink>
        </div>
        <div>
          <Navlink to="/">
            <Tsl id="Go to" />
            /
          </Navlink>
          <br />
          <Navlink to="/unknown">
            <Tsl id="Go to" />
            /unknown
          </Navlink>
          <br />
          <Navlink to="/ru">
            <Tsl id="Go to" />
            /ru
          </Navlink>
          <br />
          <Navlink to="/ru/order">
            <Tsl id="Go to" />
            /ru/order
          </Navlink>
          <br />
          <Navlink to="/en">
            <Tsl id="Go to" />
            /en
          </Navlink>
          <br />
          <Navlink to="/en/unknown">
            <Tsl id="Go to" />
            /en/unknown
          </Navlink>
        </div>
        <div>Uniquehomepage</div>
      </React.Fragment>
    );
  }
}

export default connect((state) => {
  return {
    language: state.App.route.params.language,
  };
}, null)(HomePage);
