import React from 'react';
import PropTypes from 'prop-types';

const CountryDetails = ({
  name,
  lastBought,
  totalPlots,
  plotsBought,
  plotsMined,
  plotsAvailable,
  image,
  lastPrice,
  roi,
}) => {
  console.log('name', name);
  return (
    <div className="flex mv5 mw8 center pa3 row-ns flex-column-reverse">
      <div className="w-50-ns w-100">
        <h1 className="white f1">{name}</h1>
        <small>
          Owned for
          {lastBought}
        </small>

        <div className="flex aic">
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Price Paid</dd>
            <dd className="f3 f2-ns b ml0">{lastPrice}</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Plots Remaining</dd>
            <dd className="f3 f2-ns b ml0">{totalPlots - plotsBought}</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Return on Investment</dd>
            <dd className="f3 f2-ns b ml0">{roi || '0%'}</dd>
          </dl>
        </div>

        <dl className="w-100">
          <h3 className="white">DETAILS</h3>
          <span className="flex">
            <dt>Total Plots</dt>
            <dd>{totalPlots}</dd>
          </span>
          <span className="flex">
            <dt>Plots Bought</dt>
            <dd>{plotsBought}</dd>
          </span>
          <span className="flex">
            <dt>Plots Mined</dt>
            <dd>{plotsMined}</dd>
          </span>

          <span className="flex">
            <dt>Plots for Auction</dt>
            <dd>{plotsAvailable}</dd>
          </span>
        </dl>
      </div>
      <div className="w-50-ns w-100">
        <div className="flex x mv5">
          <img src={image} alt={name} className="h-auto w-100" />
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;

CountryDetails.propTypes = {
  name: PropTypes.string.isRequired,
  lastBought: PropTypes.number.isRequired,
  totalPlots: PropTypes.number.isRequired,
  plotsBought: PropTypes.number.isRequired,
  plotsMined: PropTypes.number.isRequired,
  plotsAvailable: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  lastPrice: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
};
