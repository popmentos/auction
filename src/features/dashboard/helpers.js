import fromExponential from 'from-exponential';
import { BigNumber } from 'bignumber.js';
import {
  db,
  storage,
  // rtdb
} from '../../app/utils/firebase';
import { setError } from '../../app/appActions';

export function isTokenForSale(_contract, _tokenId) {
  return _contract.methods.isTokenOnSale(_tokenId).call();
}

export const getAuctionDetails = (_contract, _tokenId) => _contract.methods
  .items(_tokenId)
  .call()
  .then((result) => {
    const {
      t0, t1, p0, p1,
    } = result;
    return [t0, t1, p0, p1];
  });

export const getGemStory = (color, level) => {
  const type = {
    1: 'garnet',
    2: 'amethyst',
    3: 'aquamarine',
    4: 'diamond',
    5: 'emerald',
    6: 'pearl',
    7: 'ruby',
    8: 'peridot',
    9: 'sapphire',
    10: 'opal',
    11: 'topaz',
    12: 'turquoise',
  }[color];
  const lvl = `lvl${level}`;
  return db
    .doc(`gems/${type}`)
    .get()
    .then(doc => doc.data()[lvl]);
};

export const getGemImage = (color, grade, level) => {
  const type = {
    9: 'Sap',
    10: 'Opa',
    1: 'Gar',
    2: 'Ame',
  }[color];

  const gradeType = {
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[grade];

  const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

  return storage.ref(`gems512/${sourceImage}`).getDownloadURL();
};

export const calcMiningRate = (gradeType, gradeValue) => ({
  1: gradeValue / 200000,
  2: 10 + gradeValue / 200000,
  3: 20 + gradeValue / 200000,
  4: 40 + (3 * gradeValue) / 200000,
  5: 100 + gradeValue / 40000,
  6: 300 + gradeValue / 10000,
}[gradeType]);

export const getGemQualities = (_contract, _tokenId) => _contract.methods
  .getProperties(_tokenId)
  .call()
  .then((_properties) => {
    // web3.utils.toBN(number)
    const properties = new BigNumber(_properties);
    const color = properties.dividedToIntegerBy(0x10000000000).toNumber();
    const level = properties
      .dividedToIntegerBy(0x100000000)
      .modulo(0x100)
      .toNumber();
    const gradeType = properties
      .dividedToIntegerBy(0x1000000)
      .modulo(0x100)
      .toNumber();
    const gradeValue = properties.modulo(0x1000000).toNumber();
    return [color, level, gradeType, gradeValue];
  });

export function getPrice(_tokenId, _contract, gemContract) {
  return _contract.methods.getCurrentPrice(gemContract, _tokenId).call();
}

export const nonExponential = count => fromExponential(Number(count) / 1000000000000000000);

export const calculateGemName = (providedGrade, providedTokenId) => {
  const gemType = {
    1: 'Garnet',
    2: 'Amethyst',

    3: 'Aquamarine',
    4: 'Diamond',
    5: 'Emerald',
    6: 'Pearl',

    7: 'Ruby',
    8: 'Peridot',

    9: 'Sapphire',
    10: 'Opal',

    11: 'Topaz',
    12: 'Turquoise',
  }[providedGrade];
  return `${gemType} #${providedTokenId}`;
};

export const getReferralPoints = (preSaleContract, userId) => preSaleContract.methods
  .unusedReferralPoints(userId)
  .call()
  .then(referralPoints => referralPoints)
  .catch(error => setError(error));

export const getPlotCount = (preSaleContract, userId) => preSaleContract.methods
  .geodeBalances(userId)
  .call()
  .then(referralPoints => referralPoints)
  .catch(error => setError(error));

export const markSold = countryId => console.log('countryId', countryId);

// eslint-disable-next-line
// export const markSold = countryId => rtdb.ref(`/worldMap/objects/units/geometries/${countryId}/properties`).update({ sold: true });

export const validateCoupon = (couponCode) => {
  const characters = couponCode.split('');

  const last3Characters = couponCode.substr(couponCode.length - 3);

  // eslint-disable-next-line
  if (isNaN(last3Characters)) {
    return false;
  }

  if (Number(last3Characters) > 190 || Number(last3Characters) < 170) {
    return false;
  }

  if (characters.length !== 20) {
    return false;
  }

  if (!characters.includes('_')) {
    return false;
  }

  if (characters[16] !== '_') {
    return false;
  }


  for (let i = 0; i < 15; i += 1) {
    // eslint-disable-next-line
    if (!isNaN(characters[i])) {
      return false;
    }
  }

  return true;
};
