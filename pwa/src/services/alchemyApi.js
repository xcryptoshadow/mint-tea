// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Alchemy, Network } from "alchemy-sdk";

/* Alchemy Chain API keys */
const ethereumAPI = import.meta.env.VITE_ALCHEMY_ETHEREUM_API_KEY;
const polygonAPI = import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY;
const optimismAPI = import.meta.env.VITE_ALCHEMY_OPTIMISM_API_KEY;
const arbitrumAPI = import.meta.env.VITE_ALCHEMY_ARBITRUM_API_KEY;
// const avalancheAPI = import.meta.env.VITE_ALCHEMY_AVALANCHE_API_KEY;
console.log("ethereumAPI: ", ethereumAPI);
console.log("polygonAPI: ", polygonAPI);
console.log("optimismAPI: ", optimismAPI);
console.log("arbitrumAPI: ", arbitrumAPI);

export default class alchemyApi {
  /**
   * Gets Account NFTs
   * @param {String} chainId
   * @param {String} accountAddress
   * @returns {Promise<Array|Error>}
   */
  async fetchAccountNfts(chainId, accountAddress) {
    if (chainId && accountAddress) {
      let settings = {};
      if (chainId === 1) {
        settings = {
          apiKey: ethereumAPI,
          network: Network.ETH_MAINNET,
        };
      } else if (chainId === 137) {
        settings = {
          apiKey: polygonAPI,
          network: Network.MATIC_MAINNET,
        };
      } else if (chainId === 10) {
        settings = {
          apiKey: optimismAPI,
          network: Network.OPT_MAINNET,
        };
      } else if (chainId === 42161) {
        settings = {
          apiKey: arbitrumAPI,
          network: Network.ARB_MAINNET,
        };
      }
      const alchemy = new Alchemy(settings);
      try {
        /* Get the latest block */
        const latestBlock = await alchemy.core.getBlockNumber();
        console.log("Latest Block: ", latestBlock);

        /* Get all outbound transfers for a provided address */
        // Get token balances
        const balances = await alchemy.core
          .getTokenBalances(accountAddress, "DEFAULT_TOKENS")
          .then(console.log);

        console.log("balances: ", balances);

        // Get all the NFTs owned by an address
        const nfts = await alchemy.nft.getNftsForOwner(accountAddress);
        console.log("Nfts : ", nfts);
        if (nfts.totalCount > 0) {
          return nfts.ownedNfts;
        }

        // Listen to all new pending transactions
        // alchemy.ws.on(
        //   {
        //     method: "alchemy_pendingTransactions",
        //     fromAddress: accountAddress,
        //   },
        //   (res) => console.log(res)
        // );
        return;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
