import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-spring';
import CountryDetails from './CountryDetails';
import { CountryBar } from './CountryBar';

require('antd/lib/avatar/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/card/style/css');

class Countries extends Component {
  static propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    countries: null,
  };

  state = {
    index: null,
    selected: false,
  };

  componentDidMount() {
    // if there is a country name hash in the url open the workshop page on that country
    const { countries } = this.props;
    const country = window.location.hash.substring(1);

    const turnEmptySpaceIntoPercent20 = string => string.trim().replace(/\s+/g, '%20');

    if (countries && country) {
      // eslint-disable-next-line
      const index = countries.findIndex(
        nation => turnEmptySpaceIntoPercent20(nation.name) === turnEmptySpaceIntoPercent20(country),
      );
      if (index >= 0) {
        this.setState({ index, selected: true });
      }
    }
  }

  selectCountry = (index) => {
    this.setState({ index, selected: true });
  };

  render() {
    const { index, selected } = this.state;
    const { countries, showForOwner } = this.props;

    return (
      <div data-testid="countriesExist" id="top" className="pa0 center">
        <Transition
          items={countries[index]}
          from={{ transform: 'translate3d(0,-40px,0)' }}
          enter={{ transform: 'translate3d(0,0px,0)' }}
          leave={{ transform: 'translate3d(0,-40px,0)' }}
        >
          {() => selected && (
          <CountryDetails
            showForOwner={showForOwner}
            name={countries[index].name}
            countryId={countries[index].countryId}
            lastBought={countries[index].lastBought}
            totalPlots={countries[index].totalPlots}
            plotsBought={countries[index].plotsBought}
            plotsMined={countries[index].plotsMined}
            plotsAvailable={countries[index].plotsAvailable}
            image={countries[index].imageLinkLarge}
            lastPrice={countries[index].lastPrice}
            roi={countries[index].roi}
          />
          )
          }
        </Transition>
        <CountryBar countries={countries} selectCountry={this.selectCountry} />
      </div>
    );
  }
}

export default Countries;
