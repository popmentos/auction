import {MINING, NO_GEM} from "../plots/plotConstants";

export const setDashboardEventListeners = ({plotService, updatedEventCallback, releasedEventCallback, boundEventCallback, currentUserId, transactionResolved}) => {
    console.log("SETTING UP EVENT LISTENERS");
    plotService.minerContracts.forEach((minerContract) => {
        minerContract.events.Updated({
            filter: {'_by': currentUserId},
            fromBlock: 'latest'
        })
          .on('data', async function (event) {
              console.log("updated event ");
              const eventParams = event.returnValues;
              transactionResolved(event);
              updatedEventCallback({
                  id: Number(eventParams['plotId']),
                  processedBlocks: eventParams['offsetTo'],
              });
          })
          .on('changed', function (event) {
              console.log('CHANGED EVENT:', event);
          })
          .on('error', console.error);
        //todo: replace minerContracts[0] with iterating over all miner contracts
        minerContract.events.Released({
            filter: {'_by': currentUserId},
            fromBlock: 'latest'
        })
          .on('data', function (event) {
              const eventParams = event.returnValues;
              transactionResolved(event);
              releasedEventCallback({id: Number(eventParams['plotId']), miningState: NO_GEM, gemMines: null, gemMinesId: null, state: 0});
          })
          .on('changed', function (event) {
              console.log('CHANGED EVENT:', event);
          })
          .on('error', console.error);

        minerContract.events.Bound({
            filter: {'_by': currentUserId},
            fromBlock: 'latest'
        })
          .on('data', function (event) {
              const eventParams = event.returnValues;
              transactionResolved(event);
              boundEventCallback({id: Number(eventParams['plotId']), miningState: MINING, gemMinesId: eventParams['gemId'], state: 1});
          })
          .on('changed', function (event) {
              console.log('CHANGED EVENT:', event);
          })
          .on('error', console.error);
    });
    console.log("EVENT LISTENERS SET UP");
};