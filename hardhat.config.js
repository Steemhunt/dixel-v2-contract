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
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true, // argv.enableGasReport || argv.compileMode === 'production',
        runs: 5000,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 60000000
    },
    ethmain: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ETH_API_KEY}`,
      chainId: 1,
      gasPrice: 14000000000, // 14 gwei
      blockGasLimit: 29000000, // 29M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    bscmain: {
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      gasPrice: 5600000000, // 5.2 GWei
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
    klaytnmain: {
      url: `https://public-en.node.kaia.io`,
      chainId: 8217,
      gasPrice: 250000000000, // 250 ston
      blockGasLimit: 60000000, // 60M
      accounts: [process.env.ETH_PRIVATE_KEY]
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
    baseSepolia: {
      url: `https://sepolia.base.org`,
      chainId: 84532,
      accounts: [process.env.TEST_PRIVATE_KEY]
    }
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 10,
    coinmarketcap: process.env.COIN_MARKET_CAP_API
  },
  etherscan: {
    // network list: https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-etherscan/src/ChainConfig.ts
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY,
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
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
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
