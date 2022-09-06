import axios from "axios";

const nftPortApiKey = import.meta.env.VITE_NFT_PORT_API_KEY;
console.log("nftPortApiKey", nftPortApiKey);

export default class nftPort {
  constructor() {
    this.endpoint = "https://api.nftport.xyz/v0/search/";
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
    text = "",
    filter_by_contract_address = "",
    chain = "all",
    sort_order = "desc",
    order_by = "relevance",
    page_size = 50,
    page_number = 1
  ) {
    if (text !== "") {
      const options = {
        method: "GET",
        url: this.endpoint,
        params: {
          text: text,
          filter_by_contract_address: filter_by_contract_address,
          chain: chain,
          sort_order: sort_order,
          order_by: order_by,
          page_size: page_size,
          page_number: page_number,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: nftPortApiKey,
        },
      };

      await axios
        .request(options)
        .then(function (response) {
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
          console.log(response.data);

          const data = response.data;
          return data.search_results;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    return;
  }
}
