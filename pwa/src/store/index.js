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
    ethereumTokens: [],
    polygonTokens: [],
    optimismTokens: [],
    arbitrumTokens: [],
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
     */
    async fetchNFTs(contract, name, chainid) {
      console.log("Search contract:", contract);
      console.log("Search name:", name);
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

    /**
     * Fetch NFTs
     * @param {String} contract
     * @param {String} name
     */
    async fetchAnneNFTs(contract, name, chainid) {
      console.log("Search contract:", contract);
      console.log("Search name:", name);
      console.log("Search chainid:", chainid);

      this.loading = true;

      const authAccount = new authNFT();
      /* Polygon */
      let polygonTokens = await authAccount.fetchAccountNfts(137, contract);
      this.addPolygonTokens(...polygonTokens);
      let polygonTestnetTokens = await authAccount.fetchAccountNfts(
        80001,
        contract
      );
      this.addPolygonTokens(...polygonTestnetTokens);
    },
  },
});
