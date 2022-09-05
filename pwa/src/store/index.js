// import { ethers } from "ethers";
import { defineStore } from "pinia";
import authNFT from "../services/authNFT.js";

/* Import Smart Contract ABI */
// import contractAbi from "../../../artifacts/contracts/MintTeaCore.sol/MintTeaCore.json";
/* Get our Mint Tea Contract Address */
// const contractAddress = import.meta.env.VITE_MINT_TEA_CORE_CONTRACT;

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
    craigTokens: [],
    anneTokens: [],
    keremTokens: [],
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
    getCraigTokens(state) {
      return state.craigTokens;
    },
    getAnneTokens(state) {
      return state.anneTokens;
    },
    getKeremTokens(state) {
      return state.keremTokens;
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
    addCraigTokens(...tokens) {
      this.craigTokens.push(...tokens);
    },
    addAnneTokens(...tokens) {
      this.anneTokens.push(...tokens);
    },
    addKeremTokens(...tokens) {
      this.keremTokens.push(...tokens);
    },

    /**
     * Get User 🦊 Metamask Account Balance
     */
    // async getBalance() {
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
    //         // contractAbi.abi,
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
    //     console.log("getBalance Error:", error);
    //   }
    // },

    /**
     * Fetch NFTs
     * @param {String} contract
     * @param {String} name
     * @param {String} image
     * @param {String} chainid
     */
    async fetchNFTs(contract, name, image, chainid) {
      console.log("Fetch Contract address:", contract);
      console.log("Fetch Name:", name);
      console.log("Fetch Image:", image);
      console.log("Fetch chainid:", chainid);

      this.loading = true;

      const authAccount = new authNFT();

      /* Ethereum */
      let ethereumTokens = await authAccount.fetchAccountNfts(1, contract);
      this.addEthereumTokens(...ethereumTokens);
      let ethereumTestnetTokens = await authAccount.fetchAccountNfts(
        5,
        contract
      );
      this.addEthereumTokens(...ethereumTestnetTokens);

      /* Polygon */
      let polygonTokens = await authAccount.fetchAccountNfts(137, contract);
      this.addPolygonTokens(...polygonTokens);
      let polygonTestnetTokens = await authAccount.fetchAccountNfts(
        80001,
        contract
      );
      this.addPolygonTokens(...polygonTestnetTokens);

      /* Optimism */
      // let optimismTokens = await authAccount.fetchAccountNfts(10, contract);
      // this.addOptimismTokens(...optimismTokens);
      // let optimismTestnetTokens = await authAccount.fetchAccountNfts(
      //   69,
      //   contract
      // );
      // this.addOptimismTokens(...optimismTestnetTokens);

      /* Arbitrum */
      // let arbitrumTokens = await authAccount.fetchAccountNfts(42161, contract);
      // this.addArbitrumTokens(...arbitrumTokens);
      // let arbitrumTestnetTokens = await authAccount.fetchAccountNfts(
      //   42161,
      //   contract
      // );
      // this.addArbitrumTokens(...arbitrumTestnetTokens);

      this.loading = false;
    },

    /**
     * Fetch NFTs
     * @param {String} contract
     * @param {String} name
     * @param {String} image
     * @param {String} chainid
     */
    async searchNFTs(contract, name, image, chainid) {
      console.log("Search Contract address:", contract);
      console.log("Search Name:", name);
      console.log("Search Image:", image);
      console.log("Search chainid:", chainid);

      this.loading = true;

      const authAccount = new authNFT();

      /* Ethereum */
      let ethereumTokens = await authAccount.fetchAccountNfts(1, contract);
      this.addEthereumTokens(...ethereumTokens);
      let ethereumTestnetTokens = await authAccount.fetchAccountNfts(
        5,
        contract
      );
      this.addEthereumTokens(...ethereumTestnetTokens);

      /* Polygon */
      let polygonTokens = await authAccount.fetchAccountNfts(137, contract);
      this.addPolygonTokens(...polygonTokens);
      let polygonTestnetTokens = await authAccount.fetchAccountNfts(
        80001,
        contract
      );
      this.addPolygonTokens(...polygonTestnetTokens);

      /* Optimism */
      // let optimismTokens = await authAccount.fetchAccountNfts(10, contract);
      // this.addOptimismTokens(...optimismTokens);
      // let optimismTestnetTokens = await authAccount.fetchAccountNfts(
      //   69,
      //   contract
      // );
      // this.addOptimismTokens(...optimismTestnetTokens);

      /* Arbitrum */
      // let arbitrumTokens = await authAccount.fetchAccountNfts(42161, contract);
      // this.addArbitrumTokens(...arbitrumTokens);
      // let arbitrumTestnetTokens = await authAccount.fetchAccountNfts(
      //   42161,
      //   contract
      // );
      // this.addArbitrumTokens(...arbitrumTestnetTokens);

      this.loading = false;
    },
  },
});
