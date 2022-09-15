import axios from "axios";

/* Services api keys */
const etherScapAPI = import.meta.env.VITE_ETHERSCAN_API_KEY;
const polygonScapAPI = import.meta.env.VITE_POLYSCAN_API_KEY;
const infuraKey = import.meta.env.VITE_INFURA_API_KEY;
const infuraSecret = import.meta.env.VITE_INFURA_API_SECRET;

/* Mint Tea Contract Address */
const contractAddress = "0xbE3601f014e0A861bc837bD1f24822cE23592422";

export default class authNFT {
  constructor() {
    this.endpoint = new URL("https://ipfs.infura.io:5001");
  }

  /**
   * @param {String} accountAddress
   * @param {String} tokenId
   * @returns {Promise<String|Error>}
   */
  async authAccountAddress(accountAddress = "", tokenIds = null) {
    // We need to specifically check for the OpenSea contract
    // this contract doesn't show up on etherscan
    // OpenSea used 1 contract for all NFTs minted on their site
    // so we need to do an extra check for a specific token id as well
    if (
      accountAddress === "0x495f947276749Ce646f68AC8c248420045cb7b5e" &&
      tokenIds
    ) {
      const response = await axios.get("https://api.opensea.io/api/v1/assets", {
        headers: {
          "X-API-KEY": "",
        },
        params: {
          owner: accountAddress,
          asset_contract_address: contractAddress,
          token_ids: tokenIds,
        },
      });
      const data = response.data;
      console.log("Opensea Response Data: ", data);
      console.log("Opensea Response Status: ", response.status(200));
      return response.status(200).json({
        isAuthenticated: data.assets && data.assets.length > 0,
      });
    } else {
      /**
       * @dev TODO: Need to add a check here for the chain and switch the api
       */

      console.log("polygonScapAPI", polygonScapAPI);
      const polyResponse = await axios.get(
        "https://api-testnet.polygonscan.com/api",
        {
          params: {
            module: "account",
            action: "tokenbalance",
            contractaddress: contractAddress,
            address: accountAddress,
            tag: "latest",
            apikey: polygonScapAPI,
          },
        }
      );
      const polyData = polyResponse.data;
      console.log("Polygon Scan Response Data: ", polyData);
      console.log("Polygon Scan Response Data Result: ", polyData.result);

      console.log("etherScapAPI", etherScapAPI);
      const response = await axios.get("https://api.etherscan.io/api", {
        params: {
          module: "account",
          action: "tokenbalance",
          contractaddress: contractAddress,
          address: accountAddress,
          tag: "latest",
          apikey: etherScapAPI,
        },
      });
      const data = response.data;
      console.log("Etherscan Response Data: ", data);
      console.log("Etherscan Response Data Result: ", data.result);

      return polyData.result > 0 || data.result > 0 ? true : false;
    }
  }

  /**
   * https://docs.api.infura.io/nft/
   * Gets NFT collection metadata
   * @param {String} chainId
   * @param {String} tokenAddress
   * @returns {Promise<Array|Error>}
   * {
   *  "contract": "0xa9cb55d05d3351dcd02dd5dc4614e764ce3e1d6e",
   *  "name": "My Crypto NFT Project",
   *  "symbol": "CNSYS",
   *  "tokenType": "ERC-721"
   * }
   */
  async fetchNftCollection(chainId, tokenAddress) {
    if (chainId && tokenAddress) {
      try {
        const response = await axios.get(
          `https://nft.api.infura.io/networks/${chainId}/nfts/${tokenAddress}`,
          {
            headers: {},
            auth: {
              username: infuraKey,
              password: infuraSecret,
            },
          }
        );
        const data = response.data;
        return data.assets;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  /**
   * https://docs.api.infura.io/nft/
   * Gets all NFTs with metadata currently owned by a given address
   * @param {String} chainId
   * @param {String} accountAddress
   * @returns {Promise<Array|Error>}
   * {
   *  "pageNumber": 1,
   *  "network": "ETHEREUM",
   *  "total": 1,
   *  "account": "0x0a267cf51ef038fc00e71801f5a524aec06e4f07",
   *  "type": "NFT",
   *  "assets": [
   *    {
   *      "contract": "0x8e04b34166612e73e8f8b7d7a5ddb6ea2895b4b5",
   *      "tokenId": "3545",
   *      "supply": "1",
   *      "type": "ERC721",
   *      "metadata": {
   *        "description": "Hello world.",
   *        "image": "https://ipfs.io/ipfs/QmbxwZsUSBT3sGUuWCMLeuMzHcgq5eK2zjxFrYnUcoV1Du",
   *        "name": "Hello world.",
   *        "attributes": [
   *          {
   *            "trait_type": "Background",
   *            "value": "White"
   *          }
   *        ]
   *      }
   *    }
   *  ]
   * }
   */
  async fetchAccountNfts(chainId, accountAddress) {
    if (chainId && accountAddress) {
      try {
        const response = await axios.get(
          `https://nft.api.infura.io/networks/${chainId}/accounts/${accountAddress}/assets/nfts`,
          {
            headers: {},
            auth: {
              username: infuraKey,
              password: infuraSecret,
            },
          }
        );
        const data = response.data;
        return data.assets;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  /**
   * Gets NFT collection metadata  - https://docs.api.infura.io/nft/
   * @param {String} chainId
   * @param {String} tokenAddress
   * @param {String} tokenId
   * @returns {Promise<Array|Error>}
   * {
   *  "contract": "0xa9cb55d05d3351dcd02dd5dc4614e764ce3e1d6e",
   *  "tokenId": 1,
   *  "name": "Washington #7421",
   *  "description": "WeMint Cash First Edition: Washington #7421",
   *  "image": "https://ipfs.io/ipfs/Qmdibwx2MmendzExWgsGsyiGodMJ8hvAkLHcAVbMbpK2rG/7421.png"
   *  }
   */
  async fetchNftMetadata(chainId, tokenAddress, tokenId) {
    if (chainId && tokenAddress && tokenId) {
      try {
        const response = await axios.get(
          `https://nft.api.infura.io/networks/${chainId}/nfts/${tokenAddress}/tokens/${tokenId}`,
          {
            headers: {},
            auth: {
              username: infuraKey,
              password: infuraSecret,
            },
          }
        );
        const data = response.data;
        console.log("data", data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  /**
   * https://docs.api.infura.io/nft/
   * Gets NFT collection metadata
   * @param {String} chainId
   * @param {String} contractAddress
   * @returns {Promise<Array|Error>}
   * {
   *  "pageNumber": 1,
   *  "network": "ETHEREUM",
   *  "total": 1,
   *  "account": "0x0a267cf51ef038fc00e71801f5a524aec06e4f07",
   *  "type": "NFT",
   *  "assets": [
   *    {
   *      "contract": "0x8e04b34166612e73e8f8b7d7a5ddb6ea2895b4b5",
   *      "tokenId": "3545",
   *      "supply": "1",
   *      "type": "ERC721",
   *      "metadata": {
   *        "description": "Hello world.",
   *        "image": "https://ipfs.io/ipfs/QmbxwZsUSBT3sGUuWCMLeuMzHcgq5eK2zjxFrYnUcoV1Du",
   *        "name": "Hello world.",
   *        "attributes": [
   *          {
   *            "trait_type": "Background",
   *            "value": "White"
   *          }
   *        ]
   *      }
   *    }
   *  ]
   *}
   */
  async fetchCollectionNfts(chainId, contractAddress) {
    if (chainId && contractAddress) {
      try {
        const response = await axios.get(
          `https://nft.api.infura.io/networks/${chainId}/nfts/${contractAddress}/tokens`,
          {
            headers: {},
            auth: {
              username: infuraKey,
              password: infuraSecret,
            },
          }
        );
        const data = response.data;
        return data.assets;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
