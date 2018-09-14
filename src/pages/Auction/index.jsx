/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Confetti from 'react-confetti'
import sizeMe from 'react-sizeme'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AuctionImage from '../../components/AuctionImage';
import AuctionBox from '../../components/AuctionBox';
import DescriptionBox from '../../components/DescriptionBox/index';
import FAQ from '../../components/FAQ';
import MailingList from '../../components/MailingList';
import './animations.css';
import rockBackground from '../../images/rockBackground.png';

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    bottom: 1em;
    left: 5em;
  }
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const Auction = props => (
  <div>
    {props.releaseConfetti && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: '999' }}>
      <Confetti  {...props.size} />
    </div>}
    <div className="bg-off-black ">

      <RockOverlay>
        <div className="relative mw9 center">
          <AuctionImage sourceImage={props.sourceImage} />
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <AuctionBox
              currentPrice={props.currentPrice}
              minPrice={props.minPrice}
              maxPrice={props.maxPrice}
              deadline={props.deadline}
              handleBuyNow={props.buyNow}
              level={props.level}
              grade={props.grade}
              rate={props.rate}
              name={props.name}
              tokenId={props.tokenId}
              redirectTo={props.redirectTo}
              showConfirm={props.showConfirm}
              provider={props.provider}

            />
          </ReactCSSTransitionGroup>
        </div>
      </RockOverlay>
      <div className="bg-off-black">
        <TopHighlight />
        <div className="mw9 center relative-l">
          <DescriptionBox level={props.level} grade={props.grade} rate={props.rate} color={props.color} story={props.story} name={props.name} />
          <div className="w-50-l measure-wide-l">
            <OverlapOnDesktopView>
              <FAQ />
            </OverlapOnDesktopView>
          </div>
        </div>
      </div>
      <MailingList />
    </div>
  </div>
);


export default sizeMe({
  monitorHeight: true,
  monitorWidth: true,
})(Auction);

Auction.propTypes = {
  size: PropTypes.shape({
    monitorHeight: PropTypes.bool,
    monitorWidth: PropTypes.bool
  }).isRequired,
  deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  buyNow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
  tokenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  redirectTo: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sourceImage: PropTypes.string.isRequired,
  story: PropTypes.string.isRequired,
  provider: PropTypes.bool.isRequired
}

Auction.defaultProps = {
  redirectTo: '',
};
/* eslint-enable */