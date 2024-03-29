/// ENVVAR
// - ENABLE_GAS_REPORT
// - COMPILE_MODE

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const path = require('path');
const argv = require('yargs/yargs')()
  .env('')
  .boolean('enableGasReport')
  .boolean('ci')
  .string('compileMode')
  .argv;

require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-solhint');
require('solidity-coverage');

require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
require("hardhat-interface-generator");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true, // argv.enableGasReport || argv.compileMode === 'production',
        runs: 1500,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 60000000
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_GOERLI_API_KEY}`,
      chainId: 5,
      gasPrice: 5000000000, // 5 gwei
      blockGasLimit: 29000000, // 29M
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    ethmain: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ETH_API_KEY}`,
      chainId: 1,
      gasPrice: 14000000000, // 14 gwei
      blockGasLimit: 29000000, // 29M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    bsctest: {
      url: `https://data-seed-prebsc-2-s1.binance.org:8545/`,
      chainId: 97,
      gasPrice: 10000000000, // 10 GWei
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    bscmain: {
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      gasPrice: 5600000000, // 5.2 GWei
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    klaytntest: {
      url: `https://kaikas.baobab.klaytn.net:8651/`,
      chainId: 1001,
      gasPrice: 250000000000, // 250 ston
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    klaytnmain: {
      url: `https://klaytn01.fandom.finance/`,
      chainId: 8217,
      gasPrice: 250000000000, // 250 ston
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.KLAYTN_PRIVATE_KEY]
    },
    okctest: {
      url: `https://exchaintestrpc.okex.org/`,
      chainId: 65,
      gasPrice: 120000000, // 0.12 Gwei
      blockGasLimit: 2400000, // 2.4M
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    okcmain: {
      url: `https://exchainrpc.okex.org/`,
      chainId: 66,
      gasPrice: 120000000, // 0.12 Gwei
      blockGasLimit: 2400000, // 2.4M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    polygontest: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      chainId: 80001,
      gasPrice: 40000000000, // 40 Gwei - https://gasstation-mumbai.matic.today/v2
      blockGasLimit: 20000000, // 20M
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    polygonmain: {
      url: `https://polygon-rpc.com/`,
      chainId: 137,
      gasPrice: 40000000000, // 40 Gwei
      blockGasLimit: 20000000, // 20M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    base: {
      url: `https://base.drpc.org`,
      chainId: 8453,
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 10,
    coinmarketcap: process.env.COIN_MARKET_CAP_API
  },
  etherscan: {
    // network list: https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-etherscan/src/ChainConfig.ts
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
    ]
  },
  mocha: {
    timeout: 120000 // 2 minutes for test timeout
  }
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
