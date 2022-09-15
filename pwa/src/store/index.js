// import { ethers } from "ethers";
import { defineStore } from "pinia";
import nftPort from "../services/nftPort.js";

/* Import Smart Contract ABI */
// import contractAbi from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
/* Mint Tea Contract Address */
// const contractAddress = "0xbE3601f014e0A861bc837bD1f24822cE23592422";

/* LFG */
export const useStore = defineStore({
  id: "store",
  state: () => ({
    loading: false,
    account: null,
    balance: null,
    searchChainId: 1,
    searchContract: "",
    searchName: "",
    searchImage: "",
    searchResults: [],
    ethereumTokens: [],
    polygonTokens: [],
    optimismTokens: [],
    arbitrumTokens: [],
    anneTokens: [],
    keremTokens: [],
    topTokens: [],
    latestTokens: [],
  }),
  getters: {
    isLoading(state) {
      return state.loading;
    },
    getAccount(state) {
      return state.account;
    },
    getBalance(state) {
      return state.balance;
    },
    getSearchChainId(state) {
      return state.searchChainId;
    },
    getSearchContract(state) {
      return state.searchContract;
    },
    getSearchName(state) {
      return state.searchName;
    },
    getSearchImage(state) {
      return state.searchImage;
    },
    getSearchResults(state) {
      return state.searchResults;
    },
    getEthereumTokens(state) {
      return state.ethereumTokens;
    },
    getPolygonTokens(state) {
      return state.polygonTokens;
    },
    getOptimismTokens(state) {
      return state.optimismTokens;
    },
    getArbitrumTokens(state) {
      return state.arbitrumTokens;
    },
    getAnneTokens(state) {
      return state.anneTokens;
    },
    getKeremTokens(state) {
      return state.keremTokens;
    },
    getTopTokens(state) {
      return state.topTokens;
    },
    getLatestTokens(state) {
      return state.latestTokens;
    },
  },
  actions: {
    setLoading(value) {
      this.loading = value;
    },
    updateAccount(account) {
      this.account = account;
    },
    updateBalance(balance) {
      this.balance = balance;
    },
    updateSearchChainId(searchChainId) {
      this.searchChainId = searchChainId;
    },
    updateSearchContract(searchContract) {
      this.searchContract = searchContract;
    },
    updateSearchName(searchName) {
      this.searchName = searchName;
    },
    updateSearchImage(searchImage) {
      this.searchImage = searchImage;
    },
    addSearchResults(...tokens) {
      this.searchResults.push(...tokens);
    },
    clearSearchResults() {
      this.searchChainId = 1;
      this.searchContract = "";
      this.searchName = "";
      this.searchImage = "";
      this.searchResults = [];
    },
    addEthereumTokens(...tokens) {
      this.ethereumTokens.push(...tokens);
    },
    addPolygonTokens(...tokens) {
      this.polygonTokens.push(...tokens);
    },
    addOptimismTokens(...tokens) {
      this.optimismTokens.push(...tokens);
    },
    addArbitrumTokens(...tokens) {
      this.arbitrumTokens.push(...tokens);
    },
    addAnneTokens(...tokens) {
      this.anneTokens.push(...tokens);
    },
    addKeremTokens(...tokens) {
      this.keremTokens.push(...tokens);
    },
    addTopTokens(...tokens) {
      this.topTokens.push(...tokens);
    },
    addLatestTokens(...tokens) {
      this.latestTokens.push(...tokens);
    },

    /**
     * Get User 🦊 Metamask Account Balance
     */
    // async loadBalance() {
    //   this.setLoading(true);
    //   try {
    //     /*
    //      * First make sure we have access to window.ethereum
    //      */
    //     const { ethereum } = window;
    //     if (ethereum) {
    //       const provider = new ethers.providers.Web3Provider(ethereum);
    //       const signer = provider.getSigner();
    //       const contract = new ethers.Contract(
    //         contractAddress,
    //         contractAbi.abi,
    //         signer
    //       );
    //       const count = await contract.getBalance();
    //       const amount = ethers.utils.formatEther(count);

    //       /* Console log with some style */
    //       const stylesAmount = ["color: black", "background: green"].join(";");
    //       console.log("%c💰 Get Balance Amount %s 💰", stylesAmount, amount);

    //       this.balance = amount;
    //       this.setLoading(false);
    //     }
    //   } catch (error) {
    //     this.setLoading(false);
    //     console.log("loadBalance Error:", error);
    //   }
    // },

    /**
     * NFT PORT API - Search NFTs by Name and filter by Contract Address
     * @param {String} contract Results will only include NFTs from this contract address.
     * @param {String} text Required Search query
     * @param {String} chain Allowed values: polygon / ethereum / all
     * @param {String} sort_order Allowed values: desc / asc
     * @param {String} order_by Allowed values: relevance / mint_date
     * @param {Integer} page_size Required Search query
     * @param {Integer} page_number Required Search query
     */
    async searchNFTs(
      contract,
      text,
      chain,
      sort_order,
      order_by,
      page_size,
      page_number
    ) {
      /* NFT Port API Search */
      const nftPortApi = new nftPort();
      const results = await nftPortApi.nftSearch(
        text,
        contract,
        chain,
        sort_order,
        order_by,
        page_size,
        page_number
      );
      return results;
    },

    /**
     * NFT PORT API - Fetch NFTs by Contract Address
     * @param {String} contract Results will only include NFTs from this contract address.
     * @param {String} chain Allowed values: polygon / ethereum / rinkeby
     * @param {String} include Include optional data in the response. default Allowed values: default / metadata / all
     * @param {Bool} refresh_metadata Queues and refreshes all the NFTs metadata inside the contract (i.e. all tokens)
     * if they have changed since the updated_date. Useful for example, when NFT collections are revealed.
     * @param {Integer} page_size Required Search query
     * @param {Integer} page_number Required Search query
     * @returns {Promise<String|Error>}
     */
    async contractNftSearch(
      contract,
      chain,
      include,
      refresh_metadata,
      page_size,
      page_number
    ) {
      /* NFT Port API Search */
      const nftPortApi = new nftPort();
      const results = await nftPortApi.contractNftSearch(
        contract,
        chain,
        include,
        refresh_metadata,
        page_size,
        page_number
      );
      return results;
    },

    /**
     * NFT PORT API - Fetch NFTs by Account Address
     * @param {String} account Results will only include NFTs from this account address.
     * @param {String} contract Filter by and return NFTs only from the given contract address.
     * @param {String} continuation Continuation. Pass this value from the previous response to fetch the next page.
     * @param {String} chain Allowed values: polygon / ethereum / rinkeby
     * @param {String} include Include optional data in the response. default is the default response and metadata includes NFT metadata, like in Retrieve NFT details, and contract_information includes information of the NFT’s contract.
     * Allowed values: default / metadata / contract_information  Default: default
     * @param {String} exclude Exclude data from the response. erc721 excludes ERC721 tokens and erc1155 excludes ERC1155 tokens. Allowed values: erc721 / erc1155
     * @param {Integer} page_size Required Search query
     */
    async accountNftSearch(
      account,
      contract,
      continuation,
      chain,
      include,
      exclude,
      page_size
    ) {
      /* NFT Port API Search */
      const nftPortApi = new nftPort();
      const results = await nftPortApi.accountNftSearch(
        account,
        contract,
        continuation,
        chain,
        include,
        exclude,
        page_size
      );
      return results;
    },

    /**
     * NFT PORT API - Fetch NFT Details by Contract and Token Id
     * @param {String} contract Results will only include NFTs from this contract address.
     * @param {String} token_id Results will only include NFTs from this contract address.
     * @param {String} chain Allowed values: polygon / ethereum / rinkeby
     * @param {Bool} refresh_metadata Queues and refreshes all the NFTs metadata inside the contract (i.e. all tokens)
     */
    async detailsNftSearch(contract, token_id, chain, refresh_metadata) {
      /* NFT Port API Search */
      const nftPortApi = new nftPort();
      const results = await nftPortApi.detailsNftSearch(
        contract,
        token_id,
        chain,
        refresh_metadata
      );
      return results;
    },
  },
});
