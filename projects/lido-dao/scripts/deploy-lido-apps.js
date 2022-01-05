const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const namehash = require('eth-ens-namehash').hash

const runOrWrapScript = require('./helpers/run-or-wrap-script')
const { log, logSplitter, logWideSplitter, logHeader } = require('./helpers/log')
const { readNetworkState, persistNetworkState, updateNetworkState } = require('./helpers/persisted-network-state')
const { execLive } = require('./helpers/exec')
const { filterObject } = require('./helpers/collections')
const { readAppName } = require('./helpers/aragon')

const NETWORK_STATE_FILE = process.env.NETWORK_STATE_FILE || 'deployed.json'
const RELEASE_TYPE = process.env.RELEASE_TYPE || 'major'
const APPS = process.env.APPS || '*'
const APPS_DIR_PATH = process.env.APPS_DIR_PATH || path.resolve(__dirname, '..', 'apps')

async function deployLidoApps({
  web3,
  artifacts,
  networkStateFile = NETWORK_STATE_FILE,
  appsDirPath = APPS_DIR_PATH,
  appNames = APPS,
  releaseType = RELEASE_TYPE
}) {
  const hardhatConfig = path.resolve(hardhatArguments.config || 'hardhat.config.js')
  const netId = await web3.eth.net.getId()
  const netName = network.name

  logWideSplitter()
  log(`Network ID: ${chalk.yellow(netId)}`)

  const netState = readNetworkState(networkStateFile, netId)
  if (!netState.ensAddress) {
    throw new Error(`ensAddress for network ${netId} is missing from network state file ${networkStateFile}`)
  }

  if (!network.config.ensAddress) {
    throw new Error(`ensAddress is not defined for network ${netName} in Hardhat config file ${hardhatConfig}`)
  }

  if (network.config.ensAddress.toLowerCase() !== netState.ensAddress.toLowerCase()) {
    throw new Error(
      `ensAddress for network ${netId} is different in Hardhat config file ${hardhatConfig} ` + `and network state file ${networkStateFile}`
    )
  }

  // prevent Hardhat from passing the config to subprocesses
  const env = filterObject(process.env, (key) => key.substr(0, 8) !== 'HARDHAT_')

  if (appNames && appNames !== '*') {
    appNames = appNames.split(',')
  } else {
    appNames = fs.readdirSync(appsDirPath)
  }

  for (const appName of appNames) {
    const results = await publishApp(appName, env, netName, appsDirPath, releaseType)
    updateNetworkState(netState, results)
    persistNetworkState(networkStateFile, netId, netState)
  }
}

async function publishApp(appName, env, netName, appsDirPath, releaseType) {
  logHeader(`Publishing new ${releaseType} release of app '${appName}'`)

  const appRootPath = path.resolve(appsDirPath, appName)
  const appFullName = await readAppName(appRootPath, netName)
  const appId = namehash(appFullName)

  log(`App name: ${chalk.yellow(appFullName)}`)
  log(`App ID: ${chalk.yellow(appId)}`)
  logSplitter()

  await execLive('hardhat', {
    args: [
      'publish',
      releaseType,
      '--network',
      netName,
      // workaround: force to read URL from Hardhat config
      '--ipfs-api-url',
      ''
    ],
    cwd: appRootPath,
    env
  })

  return {
    [`lido_app_${appName}_name`]: appFullName,
    [`lido_app_${appName}_id`]: appId
  }
}

module.exports = runOrWrapScript(deployLidoApps, module)
