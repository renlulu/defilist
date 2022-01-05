import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { AragonApi } from '@aragon/api-react'
import App from './App'

const reducer = (state) => {
  if (state === null) {
    return {
      oracleMembers: [],
      quorum: null,
      currentFrame: null,
      expectedEpochId: null,
      currentOraclesReportStatus: null,
      allowedBeaconBalanceAnnualRelativeIncrease: null,
      allowedBeaconBalanceRelativeDecrease: null,
      beaconReportReceiver: null,
      currentReportVariants: [],
      lastCompletedReportDelta: null,
      version: null,
      isSyncing: true,
    }
  }
  return state
}

ReactDOM.render(
  <AragonApi reducer={reducer}>
    <App />
  </AragonApi>,
  document.getElementById('root')
)
