import axios from "axios";

const nftPortApiKey = import.meta.env.VITE_NFT_PORT_API_KEY;
console.log("nftPortApiKey", nftPortApiKey);

export default class nftPort {
  constructor() {
    this.endpoint = "https://api.nftport.xyz/v0/";
  }

  /**
   *
   * @param {String} text Required Search query
   * @param {String} chain Allowed values: polygon / ethereum / all
   * @param {String} filter_by_contract_address Results will only include NFTs from this contract address.
   * @param {String} sort_order Allowed values: desc / asc
   * @param {String} order_by Allowed values: relevance / mint_date
   * @param {Integer} page_size Required Search query
   * @param {Integer} page_number Required Search query
   * @returns {Promise<String|Error>}
   *
   */
  async nftSearch(text, filter_by_contract_address, chain, order_by) {
    if (text !== "") {
      const options = {
        method: "GET",
        url: this.endpoint + "search",
        params: {
          text: text,
          filter_by_contract_address: filter_by_contract_address,
          chain: chain,
          order_by: order_by,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: nftPortApiKey,
        },
      };

      const results = await axios
        .request(options)
        .then(function (response) {
          const data = response.data;
          console.log("data", data);
          return data;
        })
        .catch(function (error) {
          console.error(error);
        });

      console.log("results", results);

      const nftCollection = {
        search_results: results.search_results,
        response: results.response,
      };
      // {
      //   "response": "OK",
      //   "search_results": [
      //     {
      //       "chain": "ethereum",
      //       "contract_address": "0x12f28e2106ce8fd8464885b80ea865e98b465149",
      //       "token_id": "100030071",
      //       "cached_file_url": "https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x12f28e2106ce8fd8464885b80ea865e98b465149_t_100030071_raw_asset.png",
      //       "name": "Name field value in NFT metadata",
      //       "description": "Description field value in NFT metadata",
      //       "mint_date": "2020-10-29T15:03:54.838612"
      //     }
      //   ]
      // }
      console.log("nftCollection", nftCollection);
      return nftCollection;
    }
    return;
  }

  /**
   *
   * @param {String} contract_address Results will only include NFTs from this contract address.
   * @param {String} chain Allowed values: polygon / ethereum / rinkeby
   * @param {String} include Include optional data in the response. default Allowed values: default / metadata / all
   * @param {Bool} refresh_metadata Queues and refreshes all the NFTs metadata inside the contract (i.e. all tokens)
   * if they have changed since the updated_date. Useful for example, when NFT collections are revealed.
   * @param {Integer} page_size Required Search query
   * @param {Integer} page_number Required Search query
   * @returns {Promise<String|Error>}
   *
   */
  async contractNftSearch(
    contract_address,
    chain,
    include,
    refresh_metadata,
    page_size,
    page_number
  ) {
    const options = {
      method: "GET",
      url: this.endpoint + `nfts/${contract_address}`,
      params: {
        chain: chain,
        include: include,
        refresh_metadata: refresh_metadata,
        page_size: page_size,
        page_number: page_number,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: nftPortApiKey,
      },
    };

    const results = await axios
      .request(options)
      .then(function (response) {
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        console.error(error);
      });

    const nftCollection = {
      contract: results.contract,
      nfts: results.nfts,
      total: results.total,
      response: results.response,
    };
    return nftCollection;
  }

  /**
   *
   * @param {String} account_address Results will only include NFTs from this account address.
   * @param {String} contract_address Filter by and return NFTs only from the given contract address.
   * @param {String} continuation Continuation. Pass this value from the previous response to fetch the next page.
   * @param {String} chain Allowed values: polygon / ethereum / rinkeby
   * @param {String} include Include optional data in the response. default is the default response and metadata includes NFT metadata, like in Retrieve NFT details, and contract_information includes information of the NFT’s contract.
   * Allowed values: default / metadata / contract_information  Default: default
   * @param {String} exclude Exclude data from the response. erc721 excludes ERC721 tokens and erc1155 excludes ERC1155 tokens. Allowed values: erc721 / erc1155
   * @param {Integer} page_size Required Search query
   * @returns {Promise<String|Error>}
   *
   */
  async accountNftSearch(
    account_address,
    contract_address,
    continuation,
    chain,
    include,
    exclude,
    page_size
  ) {
    if (account_address !== "") {
      const options = {
        method: "GET",
        url: this.endpoint + `accounts/${account_address}`,
        params: {
          contract_address: contract_address,
          continuation: continuation,
          chain: chain,
          include: include,
          exclude: exclude,
          page_size: page_size,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: nftPortApiKey,
        },
      };

      const results = await axios
        .request(options)
        .then(function (response) {
          const data = response.data;
          return data;
        })
        .catch(function (error) {
          console.error(error);
        });

      const account = {
        continuation: results.continuation,
        nfts: results.nfts,
        total: results.total,
        response: results.response,
      };
      return account;
    }
    return;
  }

  /**
   *
   * @param {String} contract_address Results will only include NFTs from this contract address.
   * @param {String} token_id Results will only include NFTs from this contract address.
   * @param {String} chain Allowed values: polygon / ethereum / rinkeby
   * @param {Bool} refresh_metadata Queues and refreshes all the NFTs metadata inside the contract (i.e. all tokens)
   * if they have changed since the updated_date. Useful for example, when NFT collections are revealed.
   * @returns {Promise<String|Error>}
   *
   */
  async detailsNftSearch(contract_address, token_id, chain, refresh_metadata) {
    const options = {
      method: "GET",
      url: this.endpoint + `nfts/${contract_address}/${token_id}`,
      params: {
        chain: chain,
        refresh_metadata: refresh_metadata,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: nftPortApiKey,
      },
    };

    const results = await axios
      .request(options)
      .then(function (response) {
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        console.error(error);
      });

    const nft = {
      contract: results.contract,
      nft: results.nft,
      owner: results.owner,
      response: results.response,
    };
    return nft;
  }
}
