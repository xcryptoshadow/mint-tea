import { defineStore } from "pinia";

export const useCounterStore = defineStore({
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
