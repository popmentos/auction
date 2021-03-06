import React from 'react';
import { cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// import { renderWithRouter } from '../../../app/testSetup';
// import Auth from '../index.jsx';
// @dev this automatically unmounts and cleanup DOM after the test is finished.
afterEach(cleanup);
// const firebasemock = require('firebase-mock');
// jest.mock('firebase');

// const mockfirestore = new firebasemock.MockFirestore();
// const mockstorage = new firebasemock.MockStorage();
// const mocksdk = new firebasemock.MockFirebaseSdk(
//   // use null if your code does not use RTDB
//   null,
//   // use null if your code does not use AUTHENTICATION
//   null,
//   // use null if your code does not use FIRESTORE
//   () => mockfirestore,
//   // use null if your code does not use STORAGE
//   () => mockstorage,
//   // use null if your code does not use MESSAGING
//   null,
// );

jest.mock('react-ga');

// jest.mock('../../../app/utils/firebase.js', () => mocksdk);

// jest.mock('../../../app/utils/firebase.js');
// jest.mock('firebase/app');

// mocksdk.firestore().flush();

describe.skip('auntentication module tests', () => {
  // @dev this is all the test data, easy to configure in one place
  const props = {
    account: jest.fn(),
    handleRemoveGemFromAuction: jest.fn(),
  };

  test.skip('Auth module recieves account id from metamask', async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: '/market',
      },
    );
    expect(false).toBeFalsy();
  });

  test.skip('if no current user you get a prompt to install metamask', async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: '/market',
      },
    );
    expect(false).toBeFalsy();
  });

  test.skip('if yser exists then it loads up their data', async () => {
    expect(false).toBeFalsy();
  });

  test.skip('if users doesn;t exist then it creates a new account for them', async () => {
    const store = createStore(rootReducer);
    const { getByTestId } = renderWithRouter(
      <Provider store={store}>
        <Auth {...props} />
      </Provider>,
      {
        route: '/market',
      },
    );
    expect(true).toBeFalsy();
  });

  test.skip('listen for metamask changes in realtime', async () => {
    expect(true).toBeFalsy();
  });

  test.skip('all usernames get capilazed and trimmed', async () => {
    expect(true).toBeFalsy();
  });

  test.skip('no xml attacks through teh input fields on sign in box', async () => {
    expect(true).toBeFalsy();
  });
});
