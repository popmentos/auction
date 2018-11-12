import React from 'react';
import {
  render, fireEvent, cleanup, waitForElement,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';
// import { Router } from 'react-router-dom';
// import { createMemoryHistory } from 'history';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { TestApp } from '../../../app/App';
import CountryPage from '../index';
import CountryDashboard from '../components/Dashboard/index';
import { BUY_NOW_MUTATION } from '../mutations';
import { ALL_COUNTRIES } from '../queries';
import { renderWithRouter } from '../../../app/testSetup';
// import rootReducer from '../../../app/rootReducer';
import CountryDetails from '../components/Dashboard/CountryDetails';
import Filter from '../components/Filter';


jest.mock('firebase');
jest.mock('react-ga');

afterEach(cleanup);

const mockQuery = [
  {
    request: {
      // query: USERNAME_QUERY,
      query: gql`
        {
          user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
            name
          }
        }
      `,
      variables: { id: '123' },
    },
    result: {
      data: {
        item: 'Josh',
      },
    },
  },
];

const mockAllCountries = [
  {
    request: {
      query: ALL_COUNTRIES,
    },
    result: {
      data: {
        countries: [
          {
            key: '1',
            country: 'Brazil',
            price: 32,
            plots: 44,
            roi: 45,
            return: 54,
          },
        ],
      },
    },
  },
];

const mockMutation = [
  {
    request: {
      query: BUY_NOW_MUTATION,
      variables: { id: '123', countries: ['Brazil', 'India'] },
    },
    result: {
      data: {
        countries: [
          {
            country: 'Brazil',
            key: '1',
            plots: 44,
            price: 32,
            return: 54,
            roi: 45,
            id: '123',
          },
          {
            country: 'India',
            key: 'India',
            plots: 44,
            price: 32,
            return: 54,
            roi: 45,
            id: '123',
          },
        ],
      },
    },
  },
];

const mockLocalStateQuery = [
  {
    request: {
      query: gql`
        {
          userId @client
        }
      `,
    },
    result: {
      data: {
        userId: '0xd9b74f73d933fde459766f74400971b29b90c9d2',
      },
    },
  },
];

export const tempx = [];

export const testCountries = [
  {
    name: 'Brazil',
    key: '1',
    plots: 44,
    price: 32,
    return: 54,
    roi: 45,
    gems: 5,
    artifacts: 2,
    gold: 67,
    silver: 98,
    keys: 6,
  },
  {
    name: 'India',
    key: 'India',
    plots: 44,
    price: 32,
    return: 54,
    roi: 45,
  },
];

const handleBuyNow = jest.fn();

describe('Country Map', () => {
  test('map page renders', () => {
    const { getByTestId } = renderWithRouter(
      <MockedProvider mocks={mockQuery}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );
    expect(getByTestId('mapPage')).toBeInTheDocument();
    expect(getByTestId('mapComponent')).toBeInTheDocument();
    expect(getByTestId('cartComponent')).toBeInTheDocument();
    // expect(getByText('John Brown')).toBeInTheDocument();
  });

  test('map matches snapshot', () => {
    const { getByTestId } = renderWithRouter(
      <MockedProvider mocks={mockQuery}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );
    expect(getByTestId('mapPage')).toMatchSnapshot();
  });

  test('when I hover on a country its details appear in the detail bar', () => {
    const { getByTestId } = renderWithRouter(
      <MockedProvider mocks={mockQuery}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );
    fireEvent.mouseEnter(getByTestId('Brazil'));
    expect(getByTestId('countryDetails')).toHaveTextContent('Brazil');
  });

  test('when I select a countrty it gets added to the cart', () => {
    const { getByText, getByTestId } = renderWithRouter(
      <MockedProvider mocks={mockQuery}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );

    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
  });

  test('when I select a country in the cart it gets removed', () => {
    const { getByTestId, getByText, queryByText } = renderWithRouter(
      <MockedProvider mocks={mockQuery}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );
    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
    fireEvent.click(getByTestId('remove-India'));
    expect(queryByText('India')).not.toBeInTheDocument();
  });

  test('when I buy items the buy now metamask modal appears', () => {
    const { getByTestId, getByText } = renderWithRouter(
      <MockedProvider mocks={mockMutation}>
        <CountryPage handleBuyNow={handleBuyNow} />
      </MockedProvider>,
      {
        route: '/map',
      },
    );

    fireEvent.click(getByTestId('India'));
    expect(getByText('India')).toBeInTheDocument();
    // getByTestId('cartLoading');
    getByTestId('buyNow');
    fireEvent.click(getByTestId('buyNow'));
    // test for loading state
    expect(handleBuyNow).toBeCalled();
    expect(handleBuyNow).toBeCalledWith([
      {
        country: 'Brazil',
        key: '1',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
      {
        country: 'India',
        key: 'India',
        plots: 44,
        price: 32,
        return: 54,
        roi: 45,
      },
    ]);
  });
});

describe('Country dashboard', () => {
  test('shows no metamask if no metamask', () => {
    const { getByTestId, queryByTestId } = render(<CountryDashboard />);

    expect(getByTestId('noMetamask')).toBeInTheDocument();
    expect(queryByTestId('noAccount')).toBeNull();
    expect(queryByTestId('noCountries')).toBeNull();
    expect(queryByTestId('countriesExist')).toBeNull();
  });

  test('shows no account if no account', async () => {
    const { getByTestId, queryByTestId } = render(<CountryDashboard web3 />);
    expect(getByTestId('noAccount')).toBeInTheDocument();
    expect(queryByTestId('noCountries')).toBeNull();
    expect(queryByTestId('countriesExist')).toBeNull();
    expect(queryByTestId('noMetamask')).toBeNull();
  });

  test('shows no Countries if no Countries', async () => {
    const { getByTestId, queryByTestId } = render(<CountryDashboard web3 account />);
    expect(getByTestId('noCountries')).toBeInTheDocument();
    expect(queryByTestId('noAccount')).toBeNull();
    expect(queryByTestId('countriesExist')).toBeNull();
    expect(queryByTestId('noMetamask')).toBeNull();
  });

  test('shows Countries if you own Countries', async () => {
    const { getByTestId, queryByTestId } = render(
      <CountryDashboard web3={!false} account={!false} countries={[{ a: 1 }, { a: 2 }]} />,
    );
    // expect(queryByTestId('noMetamask')).toBeInTheDocument();
    await waitForElement(() => getByTestId('countriesExist'));
    expect(getByTestId('countriesExist')).toBeInTheDocument();
    expect(queryByTestId('noAccount')).toBeNull();
    expect(queryByTestId('noCountries')).toBeNull();
    expect(queryByTestId('noMetamask')).toBeNull();
  });

  test('once I have bought a country it appears in my profile', async () => {
    const { getByTestId } = render(<CountryDashboard web3 account countries={testCountries} />);
    await waitForElement(() => getByTestId('countriesExist'));
    // expect(getByTestId('countriesExist')).toBeInTheDocument();
  });

  test('a card is rendered for each country I own', async () => {
    const { getByTestId, queryAllByTestId } = render(
      <MockedProvider mocks={mockMutation}>
        <CountryDashboard web3 account countries={testCountries} />
      </MockedProvider>,
    );
    await waitForElement(() => getByTestId('countriesExist'));
    const CardCount = queryAllByTestId('countryCard');
    expect(CardCount.length).toBe(2);
  });
});

describe('Country map buy now button', () => {
  test.skip('buying a  country should change ownership on the database', () => {
    expect(true).toBeFalsy();
  });

  test.skip('error catch tests', () => {
    expect(true).toBeFalsy();
  });

  test.skip('buying multiple countries works teh same as buying one country', () => {
    expect(true).toBeFalsy();
  });

  test.skip('buy without metamask asks me to install metamask', () => {
    expect(true).toBeFalsy();
  });

  test.skip('buy without account asks me to sign up', () => {
    expect(true).toBeFalsy();
  });

  test.skip('buy confirms your account, price and shopping cart', () => {
    expect(true).toBeFalsy();
  });
});

describe.skip('Country gift feature', () => {
  test('when someone clicks on the gift button it fires the gift function', () => {
    const handleGiftFormSubmit = jest.fn();
    const { getByTestId } = render(
      <MockedProvider mocks={mockLocalStateQuery}>
        <CountryDetails handleGiftFormSubmit={handleGiftFormSubmit} />
      </MockedProvider>,
    );
    fireEvent.click(getByTestId('giftSubmit'));
    expect(handleGiftFormSubmit).toBeCalled();
  });
});

describe('Country Map filter', () => {
  test.skip('filter shows all countries by default', async () => {
    const { getByText, debug } = render(
      <MockedProvider mocks={mockAllCountries}>
        <Filter />
      </MockedProvider>,
    );
    debug();
    await waitForElement(() => getByText('Brazil'));
    expect(getByText('Brazil')).toBeInTheDocument();
  });

  test('when I click on a country it adds that country to my cart', () => {
    expect(true).toBeFalsy();
  });

  test('when I hover on a country it highlight the country on teh map', () => {
    expect(true).toBeFalsy();
  });

  test('sort order', () => {
    expect(true).toBeFalsy();
  });
});


test.skip('available countries are styled differently from ones that are not for sale', () => {});

test.skip('shows someone elses countries if viewiung someone elses profile', () => {});

test.skip('accessing country dashboard without an account/metamask redirect me to sign up modal', () => {
  expect(true).toBeFalsy();
});

test.skip('when I hover on a country it shows me a pointer cursor', () => {
  expect(true).toBeFalsy();
});

test.skip('info bar aggregates price when a country is not selected ', () => {
  expect(true).toBeFalsy();
});

test.skip('cancelling the metamsk prompt also cancels the buy now modal ', () => {
  expect(true).toBeFalsy();
});

test.skip('when I hover on a countrty its details appear in a tool tip', () => {
  expect(true).toBeFalsy();
});

test.skip('map details update in realtime', () => {
  expect(true).toBeFalsy();
});

test.skip('You shoud only be able to add a country once', () => {
  expect(true).toBeFalsy();
});


test('clicking on a country in teh filter zooms in on that country', () => {
  expect(true).toBeFalsy();
});

// tab structure on workshop
// profile country details update in realtime?
// gifting a country
// handling transactions

// aria compliant components (axe/heydon)
