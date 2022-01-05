const fs = require('fs')
const path = require('path')

require('@nomiclabs/hardhat-web3')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-truffle5')
require('@nomiclabs/hardhat-ganache')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')
require('solidity-coverage')

const NETWORK_NAME = getNetworkName()
const ETH_ACCOUNT_NAME = process.env.ETH_ACCOUNT_NAME

const accounts = readJson(`./accounts.json`) || {
  eth: { dev: 'remote' },
  etherscan: { apiKey: undefined },
  infura: { projectId: undefined }
}

const getNetConfig = (networkName, ethAccountName) => {
  const netState = readJson(`./deployed-${networkName}.json`) || {}
  const ethAccts = accounts.eth || {}
  const base = {
    accounts: ethAccountName === 'remote' ? 'remote' : ethAccts[ethAccountName] || ethAccts[networkName] || ethAccts.dev || 'remote',
    ensAddress: netState.ensAddress,
    timeout: 60000
  }
  const dev = {
    ...base,
    url: 'http://localhost:8545',
    chainId: 1337,
    gas: 8000000 // the same as in Görli
  }
  const byNetName = {
    dev,
    e2e: {
      ...base,
      accounts: accounts.eth.e2e,
      url: 'http://localhost:8545',
      chainId: 1
    },
    hardhat: {
      blockGasLimit: 20000000,
      gasPrice: 0,
      accounts: {
        mnemonic: 'hardhat',
        count: 20,
        accountsBalance: '100000000000000000000000',
        gasPrice: 0
      }
    },
    'goerli-pyrmont': {
      ...base,
      url: 'http://206.81.31.11/rpc',
      chainId: 5
    },
    rinkeby: {
      ...base,
      url: 'https://rinkeby.infura.io/v3/' + accounts.infura.projectId,
      chainId: 4,
      timeout: 60000 * 10
    },
    goerli: {
      ...base,
      url: 'https://goerli.infura.io/v3/' + accounts.infura.projectId,
      chainId: 5,
      timeout: 60000 * 10
    },
    'mainnet-test': {
      ...base,
      url: 'https://mainnet.infura.io/v3/' + accounts.infura.projectId,
      chainId: 1,
      timeout: 60000 * 10
    },
    mainnet: {
      ...base,
      url: 'https://mainnet.infura.io/v3/' + accounts.infura.projectId,
      chainId: 1,
      timeout: 60000 * 10
    },
    fork: {
      ...base,
      chainId: 1,
      timeout: 60000 * 10,
      forking: {
        url: 'https://mainnet.infura.io/v3/' + accounts.infura.projectId
        // url: 'https://eth-mainnet.alchemyapi.io/v2/' + accounts.alchemy.apiKey
      }
    }
  }
  const netConfig = byNetName[networkName]
  return netConfig ? { [networkName]: netConfig } : {}
}

const solcSettings4 = {
  optimizer: {
    enabled: true,
    runs: 200
  },
  evmVersion: 'constantinople'
}
const solcSettings6 = {
  optimizer: {
    enabled: true,
    runs: 200
  },
  evmVersion: 'istanbul'
}
const solcSettings8 = {
  optimizer: {
    enabled: true,
    runs: 200
  },
  evmVersion: 'istanbul'
}

module.exports = {
  defaultNetwork: NETWORK_NAME,
  networks: getNetConfig(NETWORK_NAME, ETH_ACCOUNT_NAME),
  solidity: {
    compilers: [
      {
        version: '0.4.24',
        settings: solcSettings4
      },
      {
        version: '0.6.11',
        settings: solcSettings6
      },
      {
        version: '0.6.12',
        settings: solcSettings6
      },
      {
        version: '0.8.9',
        settings: solcSettings8
      }
    ],
    overrides: {
      'contracts/0.6.11/deposit_contract.sol': {
        version: '0.6.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000000 // https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa#code
          }
        }
      }
    }
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: 'USD'
  },
  etherscan: accounts.etherscan,
  aragon: {
    ipfsApi: process.env.IPFS_API_URL || 'https://goerli.lido.fi/ipfs-api/v0',
    ipfsGateway: process.env.IPFS_GATEWAY_URL || 'https://goerli.lido.fi'
  }
}

function getNetworkName() {
  if (process.env.HARDHAT_NETWORK) {
    // Hardhat passes the network to its subprocesses via this env var
    return process.env.HARDHAT_NETWORK
  }
  const networkArgIndex = process.argv.indexOf('--network')
  return networkArgIndex !== -1 && networkArgIndex + 1 < process.argv.length
    ? process.argv[networkArgIndex + 1]
    : process.env.NETWORK_NAME || 'hardhat'
}

function readJson(fileName) {
  let data
  try {
    const filePath = path.join(__dirname, fileName)
    data = fs.readFileSync(filePath)
  } catch (err) {
    return null
  }
  return JSON.parse(data)
}

if (typeof task === 'function') {
  require('./scripts/hardhat-tasks')
}
