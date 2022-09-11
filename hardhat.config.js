require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.12",
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      // Ethereum
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",

      // Optimism
      optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
      optimisticKovan: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",

      // Polygon
      polygon: process.env.POLYSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYSCAN_API_KEY || "",
    },
  },
  networks: {
    /* Main Networks */
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${
        process.env.ETHEREUM_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_PRIVATE_KEY]
          : [],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${
        process.env.POLYGON_API_KEY ?? ""
      }`,
      accounts:
        process.env.POLYGON_PRIVATE_KEY !== undefined
          ? [process.env.POLYGON_PRIVATE_KEY]
          : [],
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${
        process.env.OPTIMISM_API_KEY ?? ""
      }`,
      accounts:
        process.env.OPTIMISM_PRIVATE_KEY !== undefined
          ? [process.env.OPTIMISM_PRIVATE_KEY]
          : [],
    },
    /* Test Networks */
    "ethereum-goerli": {
      url: `https://eth-goerli.alchemyapi.io/v2/${
        process.env.ETHEREUM_GOERLI_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_GOERLI_PRIVATE_KEY]
          : [],
    },
    "optimism-kovan": {
      url: `https://opt-kovan.g.alchemy.com/v2/${
        process.env.OPTIMISM_GOERLI_API_KEY ?? ""
      }`,
      accounts:
        process.env.OPTIMISM_GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.OPTIMISM_GOERLI_PRIVATE_KEY]
          : [],
    },
    "polygon-mumbai": {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${
        process.env.ALCHEMY_POLYGON_MUMBAI_API_KEY ?? ""
      }`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    /* Development Networks */
    "optimism-kovan-staging": {
      url: `https://opt-kovan.g.alchemy.com/v2/${
        process.env.OPTIMISM_GOERLI_STAGING_API_KEY ?? ""
      }`,
      accounts:
        process.env.OPTIMISM_GOERLI_STAGING_PRIVATE_KEY !== undefined
          ? [process.env.OPTIMISM_GOERLI_STAGING_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      mining: {
        auto: !(process.env.HARDHAT_DISABLE_AUTO_MINING === "true"),
        interval: [100, 3000],
      },
    },
  },
  proxies: {
    localhost: ""
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};
