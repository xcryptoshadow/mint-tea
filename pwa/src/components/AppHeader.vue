<template>
  <header id="header">
    <div class="header-title">
      <router-link :to="{ name: 'home' }" active-class="active" exact
        ><h1><span class="emoji">🍵</span> Mint Tea</h1>
      </router-link>
    </div>
    <div class="header-menu">
      <nav>
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >Home</router-link
        >
        <router-link :to="{ name: 'marketplace' }" active-class="active" exact
          >Marketplace</router-link
        >
        <div class="right">
          <div class="button-container">
            <button
              v-if="!account"
              @click="connectWallet"
              class="connect-button"
            >
              {{ loading ? "Loading" : "Connect" }}
            </button>
            <button v-if="account" class="balance-button">
              {{ balance ? balance : 0 }}
            </button>
            <button v-if="account" class="profile-button">{{ account }}</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
import { onMounted } from "vue";
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
/* LFG */
export default {
  name: "AppHeader",
  setup() {
    /* Init Pinia Store */
    const store = useStore();
    const { account, balance, loading } = storeToRefs(store);

    /**
     * Get our current 🦊 Metamask Account
     */
    const getAccount = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) return;

        /* Get our Account Details */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          store.updateAccount(accounts[0]);
          /* Console log with some style */
          const stylesAccounts = ["color: black", "background: cyan"].join(";");
          console.log("%c🧰 Web3 Account %s 🧰", stylesAccounts, account.value);
        } else {
          console.log("No authorized MetaMask accounts connected!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    /* Connect Wallet */
    async function connectWallet() {
      const { ethereum } = window;
      store.setLoading(true);
      try {
        if (!ethereum) {
          alert("Please connect 🦊 Metamask to continue!");
          return;
        }
        const [accountAddress] = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Account Address", accountAddress);
        if (accountAddress) {
          store.updateAccount(accountAddress);
          store.setLoading(false);
        }
      } catch (error) {
        console.log("Error", error);
        store.setLoading(false);
      }
    }

    onMounted(() => {
      getAccount();
    });

    return {
      account,
      balance,
      loading,
      connectWallet,
      getAccount,
    };
  },
};
</script>
<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  background: #b388ff;
  height: 11vh;

  .header-title {
    h1 {
      font-family: "SFDisplay", Roboto, Ubuntu, "Open Sans", "Helvetica Neue",
        sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0;
      color: #000;
      span.emoji {
        font-size: 1.8rem;
      }
    }
  }

  .header-menu {
    display: flex;
    align-items: center;

    nav {
      display: flex;
      align-items: center;
      text-align: right;
      padding: 0.3em;

      a {
        color: var(--contrast-color);
        margin-right: 16px;
        padding-bottom: 8px;
        text-decoration: none;

        border-bottom: 1px solid;
        cursor: pointer;

        &.active {
          font-weight: bold;
        }
      }

      svg {
        cursor: pointer;
        font-size: 2em;
      }

      .button-container {
        display: flex;
        flex-direction: row;
      }
      .connect-button {
        min-width: 300px;
        color: #000;
        background-color: #08d0a5;
        font-size: 18px;
        font-weight: bold;
        width: auto;
        height: 55px;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
      }
      .balance-button {
        min-width: 50px;
        color: #000;
        background-color: #fff;
        font-size: 18px;
        font-weight: bold;
        width: auto;
        height: 55px;
        border: 0;
        border-radius: 5px;
        margin-right: 10px;
      }
      .profile-button {
        min-width: 300px;
        color: #000;
        background-color: #08d0a5;
        font-size: 18px;
        font-weight: bold;
        width: auto;
        height: 55px;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
