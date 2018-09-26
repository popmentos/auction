import {
  USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_RETRIEVED,
  ALL_USER_GEMS_UPLOADED,
  USER_HAS_NO_GEMS_IN_WORKSHOP,
  AUCTION_DETAILS_RECEIVED,
  NEW_AUCTION_CREATED,
  ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
  WANT_TO_SEE_ALL_GEMS
} from "./dashboardConstants";
import { db } from "../../app/utils/firebase";
import store from "../../app/store";
import { getGemQualities, calcMiningRate } from "../auction/helpers";
import { getGemImage, getGemStory, createAuctionHelper } from "./helpers";

// export const getAuctions = () => dispatch =>
//   db
//     .collection("stones")
//     .where("auctionIsLive", "==", true)
//     .onSnapshot(collection => {
//       const auctions = collection.docs.map(doc => doc.data());
//       dispatch({ type: NEW_AUCTIONS_RECEIVED, payload: auctions });
//     });

// this gets all the gems from the database
export const getUserGems = userId => () => {
  db.collection("stones")
    .where("owner", "==", userId)
    .onSnapshot(collection => {
      const gems = collection.docs.map(doc => doc.data());
      store.dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
    });

  // .get()
  // .then(collection => {
  //   const gems = collection.docs.map(doc => doc.data());
  //   store.dispatch({ type: USER_GEMS_RETRIEVED, payload: gems });
  // });
};

// this checks the smart contract to see what gems a user owns
export const getAllUserGems = (userId, gemContract) =>
  gemContract.methods
    .getCollection(userId)
    .call()
    .then(payload => {
      store.dispatch({
        type: ALL_USER_GEMS_RETRIEVED,
        payload
      });
      return payload;
    });

// this is called in authActions when you create a new User
export const getDetailsForAllGemsAUserCurrentlyOwns = userId => {
  const gemContract = store.getState().app.gemsContractInstance;
  const userName = store.getState().auth.user.name;
  const userImage = store.getState().auth.user.imageURL;

  const listOfGemIds = [];

  // export const getAllGems
  getAllUserGems(userId, gemContract).then(listOfGemIdsTheUserOwns =>
    Promise.all(
      listOfGemIdsTheUserOwns.map(gemId => {
        listOfGemIds.push(gemId);
        return getGemQualities(gemContract, gemId).then(
          ([color, level, gradeType, gradeValue]) => ({
            color,
            level,
            gradeType,
            gradeValue
          })
        );
      })
    ).then(responses => {
      const gemImages = Promise.all(
        responses.map(gem => getGemImage(gem.color, gem.gradeType, gem.level))
      );

      const gemStories = Promise.all(
        responses.map(gem => getGemStory(gem.color, gem.level))
      );

      Promise.all([gemImages, gemStories])
        .then(([images, stories]) => {
          const completeGemDetails = listOfGemIds.map((gemId, index) => ({
            id: Number(gemId),
            ...responses[index],
            rate: Number(calcMiningRate(responses[index].gradeType, responses[index].gradeValue)), 
            auctionIsLive: false,
            owner: userId,
            gemImage: images[index],
            story: stories[index],
            userName,
            userImage
          }));

          if (completeGemDetails.length === 0) {
            store.dispatch({
              type: USER_HAS_NO_GEMS_IN_WORKSHOP
            });
          } else {
            completeGemDetails.forEach(gem => db.collection("stones").add(gem));
            store.dispatch({
              type: ALL_USER_GEMS_UPLOADED,
              payload: completeGemDetails
            });
          }
        })
        .catch(error => console.warn("error s", error));
    })
  );
};

export const createAuction = payload => (dispatch, getState) => {
  //  eslint-disable-next-line
  const currentAccount = getState().auth.currentUserId;
  //  eslint-disable-next-line
  const gemsContractInstance = getState().app.gemsContractInstance;

  try {
    const { gemId, duration, startPrice, endPrice } = payload;

    createAuctionHelper(
      gemId,
      duration,
      startPrice,
      endPrice,
      gemsContractInstance,
      currentAccount
    ).then(({ deadline, minPrice, maxPrice }) => {
      db.collection(`stones`)
        .where(`id`, `==`, Number(payload.gemId))
        .get()
        .then(coll =>
          coll.docs.map(doc =>
            db.doc(`stones/${doc.id}`).update({
              auctionIsLive: true,
              deadline,
              minPrice,
              maxPrice
            })
          )
        )
        .catch(err => console.log("err", err));

      dispatch({
        type: NEW_AUCTION_CREATED,
        payload
      });
    });
  } catch (error) {
    console.log("error", error);
  }
};

// @notice removes a gem from an auction
export const removeFromAuction = tokenId => async (dispatch, getState) => {
  getState()
    .app.dutchContractInstance.methods.remove(tokenId)
    .send();

  db.collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .get()
    .then(coll => {
      coll.docs.map(doc => {
        dispatch({
          type: "GEM_REMOVED_FROM_AUCTION"
        });
        return db.doc(`stones/${doc.id}`).update({
          auctionIsLive: false
        });
      });
    });
};

export const getGemDetails = tokenId => dispatch =>
  db
    .collection(`stones`)
    .where(`id`, `==`, Number(tokenId))
    .onSnapshot(coll => {
      const gemDetails = coll.docs.map(doc => doc.data());
      dispatch({
        type: AUCTION_DETAILS_RECEIVED,
        payload: gemDetails[0]
      });
    });

export const onlyGemsInAuction = () => ({
  type: ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS
});

export const allMyGems = () => ({
  type: WANT_TO_SEE_ALL_GEMS
});
