import axios from "axios";
import { useStore } from "../store";

const nftPortApiKey = import.meta.env.VITE_NFT_PORT_API_KEY;

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
  async nftSearch(
    text,
    filter_by_contract_address,
    chain,
    sort_order,
    order_by,
    page_size,
    page_number
  ) {
    console.log("Filter by Contract:", filter_by_contract_address);
    console.log("Search Text:", text);
    console.log("Search Chain:", chain);
    console.log("Search sort_order:", sort_order);
    console.log("Search order_by:", order_by);
    console.log("Search page_size:", page_size);
    console.log("Search page_number:", page_number);
    const options = {
      method: "GET",
      url: this.endpoint + "search",
      params: {
        text: text,
        filter_by_contract_address: filter_by_contract_address,
        chain: chain,
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
        const store = useStore();
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Error Code: ", error.response.data.error.code);
          store.setErrorCode(error.response.data.error.code);

          console.log("Error Status: ", error.response.status);
          store.setErrorStatus(error.response.status);

          console.log("Error Message: ", error.response.data.error.message);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Error Request: ", error.request);
        } else {
          /* Something happened in setting up the request that triggered an Error */
          console.log("Error Code: ", error.code);
          store.setErrorCode(error.code);

          console.log("Error Status: ", error.status);
          store.setErrorStatus(error.status);

          console.log("Error Message: ", error.message);
          store.setErrorMessage(error.message);
        }
        // console.log("error.config", error.config);
        // console.log("error.toJSON()", error.toJSON());
        return error.toJSON();
      });

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
    return results;
  }

  /**
   *
   * @param {String} image Required Search query
   * @param {String} chain Allowed values: polygon / ethereum / all
   * @param {String} filter_by_contract_address Results will only include NFTs from this contract address.
   * @param {String} sort_order Allowed values: desc / asc
   * @param {String} order_by Allowed values: relevance / mint_date
   * @param {Integer} page_size Required Search query
   * @param {Integer} page_number Required Search query
   * @returns {Promise<String|Error>}
   *
   */
  async nftSearchImage(
    image,
    filter_by_contract_address,
    chain,
    sort_order,
    order_by,
    page_size,
    page_number
  ) {
    console.log("Filter by Contract:", filter_by_contract_address);
    console.log("Search Image:", image);
    console.log("Search Chain:", chain);
    console.log("Search sort_order:", sort_order);
    console.log("Search order_by:", order_by);
    console.log("Search page_size:", page_size);
    console.log("Search page_number:", page_number);
    const options = {
      method: "GET",
      url: this.endpoint + "search",
      params: {
        image: image,
        filter_by_contract_address: filter_by_contract_address,
        chain: chain,
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
        const store = useStore();
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Error Code: ", error.response.data.error.code);
          store.setErrorCode(error.response.data.error.code);

          console.log("Error Status: ", error.response.status);
          store.setErrorStatus(error.response.status);

          console.log("Error Message: ", error.response.data.error.message);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Error Request: ", error.request);
        } else {
          /* Something happened in setting up the request that triggered an Error */
          /* https://docs.nftport.xyz/docs/nftport/ZG9jOjU5MTMzOTk3-error-codes */
          console.log("Error Code: ", error.code);
          store.setErrorCode(error.code);

          console.log("Error Status: ", error.status);
          store.setErrorStatus(error.status);

          console.log("Error Message: ", error.message);
          store.setErrorMessage(error.message);
        }
        // console.log("error.config", error.config);
        // console.log("error.toJSON()", error.toJSON());
        return error.toJSON();
      });

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
    return results;
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
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("error.response.data", error.response.data);
          console.log("error.response.status", error.response.status);
          console.log("error.response.headers", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("error.request", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        // console.log("error.config", error.config);
        // console.log("error.toJSON()", error.toJSON());
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
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("error.response.data", error.response.data);
            console.log("error.response.status", error.response.status);
            console.log("error.response.headers", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log("error.request", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          // console.log("error.config", error.config);
          // console.log("error.toJSON()", error.toJSON());
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
    // console.log("contract_address", contract_address);
    // console.log("token_id", token_id);
    // console.log("chain", chain);
    // console.log("refresh_metadata", refresh_metadata);

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
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
        const data = response.data;
        // console.log("NFT Port Response Data: ", data);
        return data;
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("error.response.data", error.response.data);
          console.log("error.response.status", error.response.status);
          console.log("error.response.headers", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("error.request", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        // console.log("error.config", error.config);
        // console.log("error.toJSON()", error.toJSON());
      });

    const nft = {
      contract: results.contract,
      nft: results.nft,
      owner: results.owner,
      response: results.response,
    };
    console.log("NFT details :", nft);
    return nft;
  }
}
