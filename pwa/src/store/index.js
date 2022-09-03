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
  },
});
