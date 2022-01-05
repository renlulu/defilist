import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { AragonApi } from '@aragon/api-react'
import App from './App'

const defaultValue = ''

const defaultState = {
  isStopped: true,
  fee: defaultValue,
  feeDistribution: {
    insuranceFeeBasisPoints: defaultValue,
    operatorsFeeBasisPoints: defaultValue,
    treasuryFeeBasisPoints: defaultValue,
  },
  withdrawalCredentials: defaultValue,
  bufferedEther: defaultValue,
  totalPooledEther: defaultValue,
  nodeOperatorsRegistry: defaultValue,
  depositContract: defaultValue,
  oracle: defaultValue,
  operators: defaultValue,
  treasury: defaultValue,
  insuranceFund: defaultValue,
  beaconStat: {
    depositedValidators: defaultValue,
    beaconBalance: defaultValue,
  },
  isSyncing: true,
}

const reducer = (state) => {
  if (state === null) {
    return defaultState
  }
  return state
}

ReactDOM.render(
  <AragonApi reducer={reducer}>
    <App />
  </AragonApi>,
  document.getElementById('root')
)
