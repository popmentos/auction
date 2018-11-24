import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import formatDistance from 'date-fns/formatDistance';
// import subMinutes from 'date-fns/subMinutes';
import moment from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import gem1 from '../../../app/images/icons/gem1.png';
import gem2 from '../../../app/images/icons/gem2.png';
import gem3 from '../../../app/images/icons/gem3.png';
import restingEnergy from '../../../app/images/icons/EnergySymbolDull.png';

momentDurationFormatSetup(moment);

class Gembox extends PureComponent {
  static propTypes = {
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    styling: PropTypes.string,
    mobileHeader: PropTypes.bool,
    restingEnergyMinutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    styling: '',
    level: 2,
    grade: 2,
    rate: 2,
    restingEnergyMinutes: null,
    mobileHeader: false,
  };

  gradeConverter = gradeValue => ({
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[gradeValue]);

  // restingEnergyConverter = (restingEnergyMinutes) => {
  //   const now = Date.now();
  //   const nowMinusMinutes = subMinutes(now, restingEnergyMinutes);
  //   const differenceInWords = formatDistance(nowMinusMinutes, now, {
  //     includeSeconds: true,
  //   });
  //   return differenceInWords;
  // };

  render() {
    const {
      level, grade, rate, styling, mobileHeader, restingEnergyMinutes,
    } = this.props;

    return (
      <div className={styling}>
        <div className="flex tc pa3">
          <Nugget quality="level" value={level} gem={gem2} />
          <Nugget quality="grade" value={this.gradeConverter(grade)} gem={gem1} />
          <Nugget quality="rate" value={rate} gem={gem3} />
        </div>
        {!mobileHeader
          && grade >= 4
          && restingEnergyMinutes && (
            <div className="w-100">
              <div className="flex jcc aic col">
                <img src={restingEnergy} alt="Resting Energy" className="h3" />
                {/* <p >
                  {this.restingEnergyConverter(restingEnergyMinutes)}
                </p> */}
                <p
                  className="ttu f5 mt2 o-50 white tc pt1 b pr2 measure"
                  data-testid="restingEnergy"
                >
                  {moment
                    .duration(restingEnergyMinutes, 'minutes')
                    .format('w [weeks], d [days], h [hours], m [minutes]')}
                </p>
              </div>
            </div>
        )}
      </div>
    );
  }
}

export default Gembox;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

export const Gem = ({ quality, image, amount }) => (
  <Feature>
    <img
      src={image}
      alt={quality}
      style={{ gridColumn: '1 / -1', gridRow: '2' }}
      className="w-auto center h3"
    />
    <p
      style={{ gridRow: 2, gridColumn: 2 }}
      className={`ttu f5 mt2 o-50 black tc pt1 b ${quality === 'grade' && 'pr2'}`}
    >
      {quality === 'rate' ? `+${amount && amount.toFixed(2)}%` : amount}
    </p>
  </Feature>
);

Gem.propTypes = {
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Gem.defaultProps = {
  quality: 1,
  image: 1,
  amount: 1,
};

const Nugget = ({ quality, value, gem }) => (
  <div className="w-100">
    <small className="ttu white dn-ns">{quality}</small>
    <Gem quality={quality} image={gem} amount={value} />
  </div>
);

Nugget.propTypes = {
  quality: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gem: PropTypes.string.isRequired,
};

Nugget.defaultProps = {
  value: 1,
};
