import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Waypoint from 'react-waypoint';
import gem1 from '../../images/icons/gem1.png';
import gem2 from '../../images/icons/gem2.png';
import gem3 from '../../images/icons/gem3.png';
import tinyDiamond from '../../images/tinyDiamond.png';
import './animations.css';


class DescriptionBox extends PureComponent {
  static propTypes = {
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  };

  state = {
    inView: false
  };

  componentDidMount() {
    const { level, color } = this.props
    this.getDetails(level, color)
  }

  handleWaypointEnter = ({ previousPosition }) => {
    if (previousPosition === Waypoint.below) {
      this.setState({ inView: true });
    }
  };

  rateConverter = rate => Math.round((rate / 400) * 100);

  getDetails = (level, color) => { // eslint-disable-next-line
    console.log(level, color);
  }


  render() {
    const { level, grade, rate } = this.props;
    const { inView } = this.state
    return (
      <div className="bg-off-black white ma0 ">
        <div className="flex-l jce mw9 center">
          <div className="w-50-l">
            <div className="pa5-ns pa3">
              <div className="flex aic tc tl-ns">
                <img
                  src={tinyDiamond}
                  alt="tiny decorative orange triangle"
                  className="dib mr3"
                />
                <h1 className="dib b white">Amethyst Thingymagij</h1>
                <img
                  src={tinyDiamond}
                  alt="tiny decorative orange triangle"
                  className="dib ml3"
                />
              </div>
              <p className="o-50">
                Click anywhere on teh line to place a bid or click on the giant
                buy now button above to buy at the current price.Click anywhere
                on teh line to place a bid or click on the giant buy now button
                above to buy at the current price.
              </p>
            </div>
            <Waypoint onEnter={this.handleWaypointEnter}>
              <div>
                {inView && (
                  <div>
                    <ReactCSSTransitionGroup
                      transitionName="example1"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        bgColour="bg-dark-orange"
                        gem={gem1}
                        category="level"
                        amount={level}
                        description="A Gem’s level determines how far down that Gem can mine. There are 5 tiers of land and 5 levels of gems. Each successive level allows for another type of land to be mined."
                      />
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                      transitionName="example2"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        bgColour="bg-dark-blue"
                        gem={gem2}
                        category="grade"
                        amount={grade}
                        description="A Gem’s Grade determines how fast it can mine. There are 6 Grades, D, C, B, A, AA, and AAA. Grade As and better all store Resting Energy when they are not mining!"
                      />
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                      transitionName="example3"
                      transitionAppear
                      transitionAppearTimeout={5000}
                      transitionEnterTimeout={5000}
                      transitionLeaveTimeout={5000}
                    >
                      <FeatureBand
                        bgColour="bg-dark-purple"
                        gem={gem3}
                        category="mining rate Bonus"
                        amount={`${this.rateConverter(rate)} %`}
                        description="This is the percentage of how much faster a Gem mines compared to the base speed. +100% is twice as fast as base, +400% is five times faster. All Mining Rate Bonuses are tied to Grades. Grades give you a general sense of how how fast a Gem mines but Mining Rate Bonuses tells you exactly how much fast it is."
                      />
                    </ReactCSSTransitionGroup>
                  </div>
                )}
              </div>
            </Waypoint>
          </div>
        </div>
      </div>
    );
  }
}

export default DescriptionBox;

const Feature = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
`;

const FeatureBand = ({ bgColour, gem, category, amount, description }) =>
  <div
    className={`w-100 ${bgColour} h5 flex aic mt3 br4-ns br--left-ns shadow-3 pa3`}
  >
    <div className="w-30 ">
      <Feature>
        <img
          src={gem}
          alt={category}
          style={{ gridColumn: '1 / -1', gridRow: '2' }}
          className="h3 center"
        />
        <p
          style={{ gridRow: 2, gridColumn: 2 }}
          className="ttu f4 b o-50 black tc"
        >
          {amount}
        </p>
      </Feature>
    </div>
    <div className="w-70">
      <p className="b ttu">{category}</p>
      <p className="measure-ns pr4-ns">{description}</p>
    </div>
  </div>

FeatureBand.propTypes = {
  bgColour: PropTypes.string.isRequired, gem: PropTypes.number.isRequired, category: PropTypes.number.isRequired, amount: PropTypes.number.isRequired, description: PropTypes.string.isRequired
};

