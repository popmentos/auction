import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStateMachine, State } from 'react-automata';
import { Formik, Field, Form } from 'formik';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { db } from '../../../app/utils/firebase';
import { OxToLowerCase } from '../../../app/utils/helpers';
import button from '../../../app/images/pinkBuyNowButton.png';
import { ReactComponent as RightArrow } from '../../../app/images/svg/arrow-right-circle.svg';

const ColourButton = styled.button`
  background-image: url(${button});
  background-position: center top;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

export const stateMachine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        GIFT: 'loading'
      }
    },
    loading: {
      onEntry: 'checkReceiverDetails',
      on: {
        SUCCESS: 'confirm',
        ERROR: 'error'
      }
    },
    confirm: {
      on: {
        TRANSFER: [
          {
            target: 'transferring',
            cond: ({ gemsContract, to, from, tokenId }) => {
              if (!gemsContract || !to || !from || !tokenId) {
                console.log(
                  'one of the necessary fields was not present for a gift transfer'
                );
                return false;
              }
              if (to === from) {
                console.log('gift to and from are the sam address');
                return false;
              }

              return true;
            }
          },
          { target: 'error' }
        ],
        CANCEL: 'idle'
      }
    },
    transferring: {
      onEntry: 'transferGem',
      on: {
        SUCCESS: 'done',
        ERROR: 'error'
      }
    },
    done: {
      onEntry: 'redirectToMarket'
    },
    error: {
      on: {
        TRANSFER: 'transferring',
        GIFT: 'loading',
        CANCEL: 'idle'
      }
    }
  }
};

class GiftGems extends Component {
  validateWalletId = values => {
    let errors = {};
    if (values.walletId === '') {
      errors.walletId = 'Please enter an ethereum wallet address.';
      return errors;
    }

    if (!this.props.web3.utils.isAddress(values.walletId)) {
      errors.walletId = 'Not a valid ethereum wallet address.';
      return errors;
    }
  };

  transferGem = () => {
    const {
      gemsContract,
      currentAccountId,
      match,
      walletId,
      transition
    } = this.props;
    const to = walletId;
    const from = currentAccountId;
    const tokenId = match.params.gemId;

    gemsContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send()
      .then(async () => {
        await this.transferOwnershipOnDatabase(from, to, tokenId);
        transition('SUCCESS', { from });
      })
      .catch(error => transition('ERROR', { error }));
  };

  transferOwnershipOnDatabase = async (from, to, tokenId) => {
    db.doc(`users/${OxToLowerCase(to)}`)
      .get()
      .then(doc => [doc.data().name, doc.data().imageURL])
      .then(([name, image]) =>
        db.doc(`stones/${tokenId}`).update({
          owner: OxToLowerCase(to),
          userName: name,
          userImage: image
        })
      )
      .catch(error => this.props.transition('ERROR', { error }));
  };

  redirectToMarket = () => {
    const { history, handleRemoveGemFromDashboard } = this.props;
    handleRemoveGemFromDashboard();
    history.push(`/profile/${this.props.from}`);
  };

  checkReceiverDetails = () => {
    const { walletId, transition } = this.props;
    db.doc(`users/${OxToLowerCase(walletId)}`)
      .get()
      .then(
        doc =>
          doc.exists === true
            ? transition('SUCCESS', {
                name: doc.data().name,
                image: doc.data().imageURL
              })
            : transition('ERROR', { error: 'No user exists' })
      )
      .catch(err => console.warn(err, 'error finding gift reciver on db'));
  };

  render() {
    const {
      transition,
      machineState,
      error,
      name,
      sourceImage,
      gemName,
      walletId
    } = this.props;
    console.log('machineState', machineState.value);
    console.error('error gifting gem', error && error);
    return (
      <Formik
        validate={this.validateWalletId}
        initialValues={{
          walletId: ''
        }}
        onSubmit={values => transition('GIFT', { walletId: values.walletId })}
        render={({ errors, touched }) => (
          <Form className="flex col jcc mt3">
            <State
              is={['idle', 'loading']}
              render={visible =>
                visible ? (
                  <div className="mt5">
                    <Field type="text" name="walletId">
                      {({ field }) => (
                        <Input
                          type="text"
                          {...field}
                          placeholder="Send this gem to someone"
                        />
                      )}
                    </Field>
                    {errors.walletId &&
                      touched.walletId && (
                        <p className="orange">{errors.walletId}</p>
                      )}
                  </div>
                ) : null
              }
            />

            <State is={['confirm', 'transferring']}>
              <div>
                <div className="flex jcb aic pa3 shadow-1 br3">
                  <div className="flex aic col ">
                    <img src={sourceImage} alt={name} className="h3 w-auto" />
                    {`${gemName}`}{' '}
                  </div>
                  <RightArrow />
                  <div className="flex aic col">
                    <img
                      src={this.props.image}
                      alt={this.props.name}
                      className="h3 w-auto"
                    />
                    {`${this.props.name}`}{' '}
                  </div>
                </div>
                <p className="tc ttu mt3 b">Continue the transfer?</p>
                <div className="flex jcb">
                  <Button type="danger" onClick={() => transition('CANCEL')}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      transition('TRANSFER', {
                        gemsContract: this.props.gemsContract,
                        to: this.props.walletId,
                        from: this.props.currentAccountId,
                        tokenId: this.props.match.params.gemId
                      })
                    }
                  >
                    {machineState.value === 'transferring' ? (
                      <span>
                        <Icon type="loading" theme="outlined" /> Transferring...
                      </span>
                    ) : (
                      'Transfer'
                    )}
                  </Button>
                </div>
              </div>
            </State>

            <State is={['error']}>
              <Input disabled value={walletId} />
              <p className="orange pt3">
                We didn't find a Cryptominer World user with this wallet
                address, would you like to send it to this wallet address
                anyway?
              </p>
              <div className="flex jcb">
                <Button type="danger" onClick={() => transition('CANCEL')}>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => transition('TRANSFER')}>
                  {machineState.value === 'transferring' ? (
                    <span>
                      <Icon type="loading" theme="outlined" /> Transferring...
                    </span>
                  ) : (
                    'Transfer'
                  )}
                </Button>
              </div>
            </State>

            <State is={['idle', 'loading']}>
              <div className="w-100 w5-ns h3 center mt4">
                <ColourButton type="submit" className="b">
                  {machineState.value === 'loading' ||
                  machineState.value === 'transferring' ? (
                    <Icon type="loading" theme="outlined" />
                  ) : (
                    <span role="img" aria-label="gift emoji">
                      🎁
                    </span>
                  )}{' '}
                  Gift
                </ColourButton>
              </div>
            </State>
          </Form>
        )}
      />
    );
  }
}

// const connectedGiftGems = props => (
//   <Subscribe to={[AppContainer]}>
//     {app => (
//       <GiftGems
//         web3={app.state.web3}
//         gemsContract={app.state.gemsContract}
//         currentAccountId={app.state.currentAccountId}
//         {...props}
//       />
//     )}
//   </Subscribe>
// );

const actions = dispatch => ({
  handleRemoveGemFromDashboard: tokenId =>
    dispatch({ type: 'GEM_GIFTED', payload: Number(tokenId) })
});

const select = store => ({
  web3: store.app.web3,
  gemsContract: store.app.gemsContractInstance,
  currentAccountId: store.app.currentAccount
});

export default compose(
  connect(
    select,
    actions
  ),
  withRouter,
  withStateMachine(stateMachine)
)(GiftGems);

export const TestGiftGems = withStateMachine(stateMachine)(GiftGems);