# Oracle Operator Manual

This document is intended for those who wish to participate in the Lido protocol as Oracle—an entity who runs a daemon synchronizing state from ETH2 to ETH1 part of the protocol. To be precise, the daemon fetches the number of validators participating in the protocol, as well as their combined balance, from the Beacon chain and submits this data to the `LidoOracle` ETH1 smart contract.

The daemon also fetches historical stETH token price (shifted by fifteen blocks) from Curve ETH/stETH pool and reports any significant changes to the `StableSwapOracle` contract. Using price data from this oracle as a safeguard helps to keep stETH token price resistant to flash-loan and sandwich attacks by removing the ability to significantly change the price in a single block.

## TL;DR

1. Generate an Ethereum address and propose it as an oracle address via the "Add Member" button in the app UI: [Mainnet] / [Görli].
2. Facilitate the DAO members to approve your oracle address.
3. Launch and sync an Ethereum 1.0 node with JSON-RPC endpoint enabled.
4. Launch and sync a Lighthouse node with RPC endpoint enabled (Prysm is not yet supported).
5. Launch the oracle daemon as a docker container.

[Mainnet]: https://mainnet.lido.fi/#/lido-dao/0x442af784a788a5bd6f42a01ebe9f287a871243fb/
[Görli]: https://testnet.testnet.fi/#/lido-testnet-prater/0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db/

## Intro

Total supply of the StETH token always corresponds to the amount of Ether in control of the protocol. It increases on user deposits and Beacon chain staking rewards, and decreases on Beacon chain penalties and slashings. Since the Beacon chain is a separate chain, Lido ETH1 smart contracts can’t get direct access to its data.

Communication between Ethereum 1.0 part of the system and the Beacon network is performed by the DAO-assigned oracles. They monitor staking providers’ Beacon chain accounts and submit corresponding data to the `LidoOracle` contract. The latter takes care of making sure that quorum about the data being pushed is reached within the oracles and enforcing data submission order (so that oracle contract never pushes data that is older than the already pushed one).

Upon every update submitted by the `LidoOracle` contract, the system recalculates the total stETH token balance. If the overall staking rewards are bigger than the slashing penalties, the system registers profit, and fee is taken from the profit and distributed between the insurance fund, the treasury, and node operators.

To protect stETH token price from attacks with borrowed money or flash loans, `StableSwapOracle` keeps valid stETH stats from Curve Pool (ETH balance, stETH balance and stETH price), shifted by fifteen blocks, onchain. To keep these stats in actual state, the daemon reports required data to the oracle when price difference between the time-shifted stETH pool price and the last reported price exceeds the threshold limit. `StableSwapOracle` validates all of the recorded data using cryptographic proofs. The threshold limit is set in the oracle contract and is purely advisory. It's introduced to prevent sending large number transactions which are pretty costly due to the Partricia Merkle proof verification.

## Prerequisites

In order to launch oracle daemon on your machine, you need to have several things:

1. A synced Ethereum 1.0 client with JSON-RPC endpoint enabled.
2. A synced Lighthouse client with RPC endpoint enabled (Prysm client not yet supported).
3) An address that’s added to the approved oracles list here: [Mainnet] / [Görli]. You have to initiate the DAO voting on adding your address there by pressing the "Add Member" button.

[Mainnet]: https://mainnet.lido.fi/#/lido-dao/0x442af784a788a5bd6f42a01ebe9f287a871243fb/
[Görli]: https://testnet.testnet.fi/#/lido-testnet-prater/0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db/

## The oracle daemon

The oracle daemon is a simple Python app that watches the Beacon chain and pushes the data to the LidoOracle Smart Contract: [Mainnet](https://etherscan.io/address/0x442af784A788A5bd6F42A01Ebe9F287a871243fb) / [Görli](https://goerli.etherscan.io/address/0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F).

The oracle source code is available at https://github.com/lidofinance/lido-oracle. The `StableSwapOracle` source code can be found at https://github.com/lidofinance/curve-merkle-oracle. The docker image is available in the public Docker Hub registry: https://hub.docker.com/r/lidofinance/oracle.

The algorithm of the above oracle implementation is simple and each step of an infinite loop can be broken down into two sub-steps: update beacon data and update stETH price data.

Update Beacon Data

The daemon fetches the reportable epoch from the `LidoOracle` contract, and if this epoch is finalized on the Beacon chain, pushes the data to the `LidoOracle` contract by submitting a transaction. The transaction contains a tuple:

```text
(
  epoch,
  sum_of_balances_of_lido_validators,
  number_of_lido_validators_on_beacon
)
```

Keep in mind that some of these transactions may revert. This happens when a transaction finalizing the current frame gets included in a block before your oracle's transaction. For example, such a transaction might had already been submitted by another oracle (but not yet included in a block) when your oracle fetched the current reportable epoch.

Update stETH Price Data

The daemon checks the time-shifted price of stETH token in Curve ETH/stETH pool and evaluates how much this price differs from the current `StableSwapOracle` state. If the difference exceeds the threshold set in the `StableSwapOracle` contract, the daemon generates offchain proof for the new stats and sends it to the contract. The contract validates the proof and records new stETH stats onchain.
This transaction can also fail in the case when another Lido oracle submits the updated state between the check and transaction submission.

#### Environment variables

The oracle daemon requires the following environment variables:

* `WEB3_PROVIDER_URI` the ETH1 JSON-RPC endpoint.
* `BEACON_NODE` the Lighthouse RPC endpoint.
* `POOL_CONTRACT` the address of the Lido contract (`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` in Mainnet and `0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F` in Görli Testnet).
* `STETH_PRICE_ORACLE_CONTRACT` the address of `StableSwapOracle` contract (`0x3A6Bd15abf19581e411621D669B6a2bbe741ffD6` in Mainnet and `0x4522dB9A6f804cb837E5fC9F547D320Da3edD49a` in Görli Testnet).
* `STETH_CURVE_POOL_CONTRACT` the address of Curve ETH/StETH Pool (`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022` in Mainnet and `0xCEB67769c63cfFc6C8a6c68e85aBE1Df396B7aDA` in Görli Testnet)
* `MEMBER_PRIV_KEY` 0x-prefixed private key of the address used by the oracle (should be in the DAO-approved list).
* `DAEMON` run Oracle in a daemon mode

#### Running the daemon

To run script you have to export three required env variables: `ETH1_NODE_RPC_ADDRESS`, `ETH2_NODE_RPC_ADDRESS`, `ORACLE_PRIVATE_KEY_0X_PREFIXED`
Before running the daemon, check that you've set all required env variables.

You can use the public Docker image to launch the daemon.

2.0.0 for Mainnet:

```sh
docker run -d --name lido-oracle \
  --env "WEB3_PROVIDER_URI=$ETH1_NODE_RPC_ADDRESS" \
  --env "BEACON_NODE=$ETH2_NODE_RPC_ADDRESS" \
  --env "MEMBER_PRIV_KEY=$ORACLE_PRIVATE_KEY_0X_PREFIXED" \
  --env "POOL_CONTRACT=0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" \
  --env "STETH_PRICE_ORACLE_CONTRACT=0x3A6Bd15abf19581e411621D669B6a2bbe741ffD6" \
  --env "STETH_CURVE_POOL_CONTRACT=0xDC24316b9AE028F1497c275EB9192a3Ea0f67022" \
  --env "DAEMON=1" \
  lidofinance/oracle:2.0.0
```

2.0.0-pre1 for Görli Testnet

```sh
docker run -d --name lido-oracle \
  --env "WEB3_PROVIDER_URI=$ETH1_NODE_RPC_ADDRESS" \
  --env "BEACON_NODE=$ETH2_NODE_RPC_ADDRESS" \
  --env "MEMBER_PRIV_KEY=$ORACLE_PRIVATE_KEY_0X_PREFIXED" \
  --env "POOL_CONTRACT=0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F" \
  --env "STETH_PRICE_ORACLE_CONTRACT=0x4522dB9A6f804cb837E5fC9F547D320Da3edD49a" \
  --env "STETH_CURVE_POOL_CONTRACT=0xCEB67769c63cfFc6C8a6c68e85aBE1Df396B7aDA" \
  --env "DAEMON=1" \
  lidofinance/oracle:2.0.0-pre1
```

This will start the oracle in daemon mode. You can also run it in a one-off mode, for example if you’d prefer to trigger oracle execution as a `cron` job. In this case, set the `DAEMON` environment variable to 0.

## Prometheus metrics

Lido Oracle daemon 2.0.0 exposes metrics via Prometheus exporter. We encourage Oracle operators to use them to monitor daemon reports and process status.
Prometheus exporter is running on port 8000 and provides 5 logical metrics groups.  
For the full list of available Prometheus metrics please check [the Lido oracle readme](https://github.com/lidofinance/lido-oracle#prometheus-metrics). We recommend to monitor at least the following ones:

| name                            | description                                                      | frequency                                 | goal                                                                                                                                                                   |
|---------------------------------|------------------------------------------------------------------|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **reportableFrame** <br> *gauge*      | the report could be sent or is sending                     |                                           |                                                                                 |
| **nowEthV1BlockNumber**  <br> *gauge* | ETH1 latest block number                                   | every COUNTDOWN_SLEEP seconds             | should be increasing constantly and be aligned with https://etherscan.io/blocks |
| **daemonCountDown** <br> *gauge*      | time till the next oracle run in seconds                   | every COUNTDOWN_SLEEP seconds             | should be decreasing down to 0                                                  |
| **finalizedEpoch** <br> *gauge*       | last finalized ETH2 epoch                                  | every COUNTDOWN_SLEEP seconds             | should go up at a rate of 1 per six munites                                     |
| **txSuccess**                     <br> *histogram* | number of successful transactions                           | every SLEEP seconds             |                                       |
| **txRevert**                      <br> *histogram* | number of failed transactions                           | every SLEEP seconds             |                                       |
| **process_virtual_memory_bytes**  <br> *gauge* | Virtual memory size in bytes.                               | every call             | normal RAM consumption is ~200Mb               |
| **process_resident_memory_bytes** <br> *gauge* | Resident memory size in bytes.                               | every call             | normal RAM consumption is ~200Mb               |

Exception counters for debugging any errors which may arise:

| name                                           | description                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------|
| **underpricedExceptionsCount**    <br> *gauge* | count of ValueError: replacement transaction underpriced          |
| **transactionTimeoutCount**       <br> *gauge* | count of web3.exceptions.TimeExhausted                            |
| **beaconNodeTimeoutCount**        <br> *gauge* | count of beacon node connection timeouts                          |
| **exceptionsCount**               <br> *gauge* | count of all other exceptions                                     |
