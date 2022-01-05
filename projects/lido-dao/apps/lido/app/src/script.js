import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'

const app = new Aragon()

app.store(
  async (state, { event }) => {
    const nextState = {
      ...state,
    }

    try {
      switch (event) {
        case 'Stopped':
          return { ...nextState, isStopped: await isStopped() }
        case 'Resumed':
          return { ...nextState, isStopped: await isStopped() }
        case 'FeeSet':
          return { ...nextState, fee: await getFee() }
        case 'FeeDistributionSet':
          return { ...nextState, feeDistribution: await getFeeDistribution() }
        case 'WithdrawalCredentialsSet':
          return {
            ...nextState,
            withdrawalCredentials: await getWithdrawalCredentials(),
          }
        case 'Unbuffered':
          return { ...nextState, bufferedEther: await getBufferedEther() }
        case events.SYNC_STATUS_SYNCING:
          return { ...nextState, isSyncing: true }
        case events.SYNC_STATUS_SYNCED:
          return { ...nextState, isSyncing: false }
        default:
          return state
      }
    } catch (err) {
      console.log(err)
    }
  },
  {
    init: initializeState(),
  }
)

/***********************
 *                     *
 *   Event Handlers    *
 *                     *
 ***********************/

function initializeState() {
  return async (cachedState) => {
    return {
      ...cachedState,
      isStopped: await isStopped(),
      fee: await getFee(),
      feeDistribution: await getFeeDistribution(),
      withdrawalCredentials: await getWithdrawalCredentials(),
      bufferedEther: await getBufferedEther(),
      totalPooledEther: await getTotalPooledEther(),
      nodeOperatorsRegistry: await getNodeOperatorsRegistry(),
      depositContract: await getDepositContract(),
      oracle: await getOracle(),
      // operators: await getOperators(),
      // treasury: await getTreasury(),
      // insuranceFund: await getInsuranceFund(),
      beaconStat: await getBeaconStat(),
    }
  }
}

// API
function isStopped() {
  return app.call('isStopped').toPromise()
}

function getFee() {
  return app.call('getFee').toPromise()
}

function getFeeDistribution() {
  return app.call('getFeeDistribution').toPromise()
}

function getWithdrawalCredentials() {
  return app.call('getWithdrawalCredentials').toPromise()
}

function getBufferedEther() {
  return app.call('getBufferedEther').toPromise()
}

function getTotalPooledEther() {
  return app.call('getTotalPooledEther').toPromise()
}

function getNodeOperatorsRegistry() {
  return app.call('getOperators').toPromise()
}

function getDepositContract() {
  return app.call('getDepositContract').toPromise()
}

function getOracle() {
  return app.call('getOracle').toPromise()
}

// async function getOperators() {
//   return await app.call('getOperators').toPromise()
// }

// async function getTreasury() {
//   return await app.call('getTreasury').toPromise()
// }

// async function getInsuranceFund() {
//   return await app.call('getInsuranceFund').toPromise()
// }

async function getBeaconStat() {
  const stat = await app.call('getBeaconStat').toPromise()
  return {
    depositedValidators: +stat.depositedValidators,
    beaconBalance: stat.beaconBalance,
  }
}
