import "@debridge-finance/hardhat-debridge";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const accounts = process.env.DEPLOYER ? [`${process.env.DEPLOYER}`] : [];

export const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    polygon: {
      chainId: 137,
      url: process.env.RPC_POLYGON || "https://polygon-rpc.com/",
      accounts,
    },
    bnb: {
      chainId: 56,
      url: process.env.RPC_BNB || "https://bsc-dataseed.binance.org",
      accounts,
    },
    avalanche: {
      chainId: 43114,
      url: process.env.RPC_AVALANCHE || "https://api.avax.network/ext/bc/C/rpc",
      accounts,
    },
    bnbTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts,
    },
    mumbai: {
      url:
        process.env.MUMBAI_RPC_ENDPOINT ||
        "https://matic-mumbai.chainstacklabs.com",
      accounts,
      gasPrice: 15,
    },
    avalancheTestnet: {
      url: " https://api.avax-test.network/ext/bc/C/rpc",
      accounts,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      polygon: `${process.env.ETHERSCAN_POLYGON_API_KEY}`,
      arbitrumOne: `${process.env.ETHERSCAN_ARBITRUMONE_API_KEY}`,
      bsc: `${process.env.ETHERSCAN_BSC_API_KEY}`,
      avalanche: `${process.env.ETHERSCAN_AVAX_API_KEY}`,
    },
  },
};

export default config;
