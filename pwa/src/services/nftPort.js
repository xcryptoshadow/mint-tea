import axios from "axios";
import { useStore } from "../store";

const nftPortApiKey = import.meta.env.VITE_NFT_PORT_API_KEY;

export default class nftPort {
  constructor() {
    this.endpoint = "https://api.nftport.xyz/v0/";
  }

  /**
   * NFT Port Search
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
          store.setErrorCode(error.response.data.error.code);
          store.setErrorStatus(error.response.status);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Error Request: ", error.request);
        } else {
          /* Something happened in setting up the request that triggered an Error */
          store.setErrorCode(error.code);
          store.setErrorStatus(error.status);
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
   * NFT PORT API - Search NFTs by Image URL and filter by Contract Address
   * @param {String} contract Results will only include NFTs from this contract address.
   * @param {String} imageUrl URL that points to the image that returns a Content-Length and Content-Type header or contains the file extension. Supports .JPG, .JPEG, .PNG, .WebP, .PPM, .BMP, .PGM, .TIF, .TIFF file formats.
   * @param {Integer} page_size Required Search query
   * @param {Integer} page_number Required Search query
   * @param {Float} threshold Threshold for classifying an NFT as a counterfeit. >= 0.1 <= 1 Default: 0.9
   * @returns {Promise<String|Error>}
   *
   */
  async nftSearchImage(
    imageUrl,
    filter_by_contract_address,
    page_size,
    page_number,
    threshold
  ) {
    console.log("Search Image:", imageUrl);
    console.log("Filter by Contract:", filter_by_contract_address);
    console.log("Search page_size:", page_size);
    console.log("Search page_number:", page_number);
    console.log("Search threshold:", threshold);

    const options = {
      method: "POST",
      url: this.endpoint + "duplicates/urls",
      headers: {
        "Content-Type": "application/json",
        Authorization: nftPortApiKey,
      },
      data: {
        url: imageUrl,
        filter_by_contract_address: filter_by_contract_address,
        page_number: page_number,
        page_size: page_size,
        threshold: threshold,
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
          store.setErrorCode(error.response.data.error.code);
          store.setErrorStatus(error.response.status);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Error Request: ", error.request);
        } else {
          /* Something happened in setting up the request that triggered an Error */
          /* https://docs.nftport.xyz/docs/nftport/ZG9jOjU5MTMzOTk3-error-codes */
          store.setErrorCode(error.code);
          store.setErrorStatus(error.status);
          store.setErrorMessage(error.message);
        }
        return error.toJSON();
      });

    // {
    //   "response": "OK",
    //   "is_similar": true,
    //   "similar_nfts": [
    //     {
    //       "contract_address": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    //       "token_id": "3100",
    //       "chain": "ethereum",
    //       "similarity": 0.999998,
    //       "file_url": "https://www.larvalabs.com/cryptopunks/cryptopunk3100.png",
    //       "cached_file_url": "https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb_t_3100_raw_asset.png",
    //       "metadata_url": "https://api.niftygateway.com/beeple/100030071/",
    //       "metadata": {
    //         "description": "ok first off it's a fucking dollar, if you need extra convincing from some BS artist's notes wether you want to spend a dollar on this i will punch you in the god damn face. smash the buy button ya jabroni.",
    //         "background_color": "ffffff",
    //         "external_url": "https://niftygateway.com/#/",
    //         "image": "https://res.cloudinary.com/nifty-gateway/video/upload/v1603975889/Beeple/POLITICAL_BULLSHIT_uqbc8x.png",
    //         "name": "POLITICS IS BULLSHIT #71/100",
    //         "animation_url": "https://res.cloudinary.com/nifty-gateway/video/upload/v1603975889/Beeple/POLITICAL_BULLSHIT_uqbc8x.mp4"
    //       },
    //       "mint_date": "2020-10-29T15:03:54.838612"
    //     }
    //   ]
    // }
    return results;
  }

  /**
   *
   * @param {String} contract Results will only include NFTs from this contract address.
   * @param {String} filter_out_contract_address NFTs from this contract address will be filtered out. Useful for examples where the whole NFT collection is visually very similar e.g. CryptoPunks.
   * @param {String} token_id A unique uint256 ID inside the contract. The contract address and token ID pair is a globally unique and fully-qualified identifier for a specific NFT on chain.
   * @param {String} chain Blockchain where the NFT has been minted. Allowed values: polygon / ethereum / all
   * @param {Integer} page_size Required Search query
   * @param {Integer} page_number Required Search query
   * @param {Number} threshold Threshold for classifying an NFT as a counterfeit. >= 0.1 <= 1 Default: 0.9
   * @returns {Promise<String|Error>}
   *
   */
  async nftSearchTokenId(
    contract_address,
    filter_out_contract_address,
    token_id,
    text,
    chain,
    page_size,
    page_number,
    threshold
  ) {
    console.log("Contract Address:", contract_address);
    console.log("Filter by Contract:", filter_out_contract_address);
    console.log("Search Token Id:", token_id);
    console.log("Search Text:", text);
    console.log("Search Chain:", chain);
    console.log("Search Page Size:", page_size);
    console.log("Search Page Number:", page_number);
    console.log("Search Threshold:", threshold);

    const options = {
      method: "POST",
      url: this.endpoint + "duplicates/tokens",
      headers: {
        "Content-Type": "application/json",
        Authorization: nftPortApiKey,
      },
      data: {
        chain: chain,
        contract_address: contract_address,
        token_id: token_id,
        text: text,
        page_number: page_number,
        page_size: page_size,
        threshold: threshold,
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
          store.setErrorCode(error.response.data.error.code);
          store.setErrorStatus(error.response.status);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Error Request: ", error.request);
        } else {
          /* Something happened in setting up the request that triggered an Error */
          /* https://docs.nftport.xyz/docs/nftport/ZG9jOjU5MTMzOTk3-error-codes */
          store.setErrorCode(error.code);
          store.setErrorStatus(error.status);
          store.setErrorMessage(error.message);
        }
        return error.toJSON();
      });

    // {
    //   "response": "OK",
    //   "is_similar": true,
    //   "similar_nfts": [
    //     {
    //       "contract_address": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    //       "token_id": "3100",
    //       "chain": "ethereum",
    //       "similarity": 0.999998,
    //       "file_url": "https://www.larvalabs.com/cryptopunks/cryptopunk3100.png",
    //       "cached_file_url": "https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb_t_3100_raw_asset.png",
    //       "metadata_url": "https://api.niftygateway.com/beeple/100030071/",
    //       "metadata": {
    //         "description": "ok first off it's a fucking dollar, if you need extra convincing from some BS artist's notes wether you want to spend a dollar on this i will punch you in the god damn face. smash the buy button ya jabroni.",
    //         "background_color": "ffffff",
    //         "external_url": "https://niftygateway.com/#/",
    //         "image": "https://res.cloudinary.com/nifty-gateway/video/upload/v1603975889/Beeple/POLITICAL_BULLSHIT_uqbc8x.png",
    //         "name": "POLITICS IS BULLSHIT #71/100",
    //         "animation_url": "https://res.cloudinary.com/nifty-gateway/video/upload/v1603975889/Beeple/POLITICAL_BULLSHIT_uqbc8x.mp4"
    //       },
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
        const store = useStore();
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          store.setErrorCode(error.response.data.error.code);
          store.setErrorStatus(error.response.status);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("error.request", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          store.setErrorCode(error.code);
          store.setErrorStatus(error.status);
          store.setErrorMessage(error.message);
        }
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
          const store = useStore();
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            store.setErrorCode(error.response.data.error.code);
            store.setErrorStatus(error.response.status);
            store.setErrorMessage(error.response.data.error.message);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log("error.request", error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            store.setErrorCode(error.code);
            store.setErrorStatus(error.status);
            store.setErrorMessage(error.message);
          }
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
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
        const data = response.data;
        // console.log("NFT Port Response Data: ", data);
        return data;
      })
      .catch(function (error) {
        const store = useStore();
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          store.setErrorCode(error.response.data.error.code);
          store.setErrorStatus(error.response.status);
          store.setErrorMessage(error.response.data.error.message);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("error.request", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          store.setErrorCode(error.code);
          store.setErrorStatus(error.status);
          store.setErrorMessage(error.message);
        }
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
