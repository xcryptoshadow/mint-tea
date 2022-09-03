// import { ethers } from "ethers";
import { defineStore } from "pinia";
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
      // const response = await fetch("/tracks/new-arrivals.json");
      // try {
      //   const result = await response.json();
      //   this.newArrivals = result;
      // } catch (err) {
      //   this.newArrivals = [];
      //   console.error("Error loading new arrivals:", err);
      //   return err;
      // }
      this.loading = false;
    },
  },
});
