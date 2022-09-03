<template>
  <header id="header">
    <div class="header-title">
      <router-link :to="{ name: 'home' }" active-class="active" exact
        ><h1>Mint Tea <span class="emoji">🍵</span></h1>
      </router-link>
    </div>
    <div class="header-menu">
      <nav class="header-navbar">
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >Home</router-link
        >
        <router-link :to="{ name: 'marketplace' }" active-class="active" exact
          >Marketplace</router-link
        >
        <div v-if="!account" class="right">
          <ConnectButton v-model="account" v-if="!account" btnSize="small" />
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

/* Components */
import ConnectButton from "../components/ConnectButton.vue";

/* LFG */
export default {
  name: "AppHeader",
  components: [ConnectButton],
  setup() {
    /* Init Pinia Store */
    const store = useStore();
    const { account } = storeToRefs(store);

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
    onMounted(() => {
      getAccount();
    });

    return {
      account,
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
  padding: 1em;

  .header-title {
    h1 {
      font-family: "SFDisplay", Roboto, Ubuntu, "Open Sans", "Helvetica Neue",
        sans-serif;
      font-size: 2.3rem;
      font-weight: 700;
      margin: 0 0 8px 0;
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
    }
  }
}
</style>
