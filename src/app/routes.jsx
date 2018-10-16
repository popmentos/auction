import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import CreateAuction from '../features/mint';
import Items from '../features/items';
import Marketplace from '../features/market';
import Dashboard from '../features/dashboard/index';

const Routes = props => (
  <Fragment>
    <Route exact path="/" component={Marketplace} />
    <Route path="/market" component={Marketplace} />
    <Route path="/mint" render={() => <CreateAuction {...props} />} />
    <Route path="/auction/:auctionid" render={() => <Items {...props} />} />
    <Route path="/profile/:userId" render={() => <Dashboard {...props} />} />
    <Route path="/gem/:gemId" render={() => <Items {...props} />} />
  </Fragment>
);

export default Routes;