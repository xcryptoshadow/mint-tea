<template>
  <section id="content">
    <div class="main">
      <section id="marketplace">
        <!-- Ethereum -->
        <h2 v-if="ethereumTokens.length > 0">Ethereum NFT Tokens</h2>
        <div v-if="ethereumTokens.length > 0" class="row token-list">
          <template v-for="token in ethereumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Polygon -->
        <h2 v-if="polygonTokens.length > 0">Polygon NFT Tokens</h2>
        <div v-if="polygonTokens.length > 0" class="row token-list">
          <template v-for="token in polygonTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Optimism -->
        <h2 v-if="optimismTokens.length > 0">Optimism NFT Tokens</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <template v-for="token in optimismTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Arbitrum -->
        <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFT Tokens</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <template v-for="token in arbitrumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>

        <h2>Marketplace</h2>
        <div v-if="!account" class="row">
          <p>
            Welcome, please connect your account to access your NFT marketplace
          </p>
          <p>
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
          </p>
        </div>
        <div v-if="account && !isAuthenticated" class="row">
          <p>
            You don't have an authorized NFT in your wallet to gain access.
            <br />Please check your account for an NFT with the following
            contract address:
            <br />
            <a
              :href="`https://etherscan.io/address/${contractAddress}`"
              target="blank"
            >
              {{ contractAddress }}
            </a>
          </p>
          <p>
            <button class="mint-button" @click="$router.push('mint')">
              Mint NFT
            </button>
            <br />
            <br />
          </p>
        </div>
        <div v-if="account && isAuthenticated" class="row">
          <p>
            Thank you for authenticating with your NFT. Browse our Music NFT
            marketplace below!
          </p>
        </div>
      </section>
    </div>
  </section>
</template>
<script setup>
import { onMounted } from "vue";
/* Import our Pinia Store */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
/* Import our IPFS and NftStorage Services */
import authNFT from "../services/authNFT.js";
/* Components */
import NftCard from "./NftCard.vue";
// Init Store
const store = useStore();

// Store Values and Methods
const {
  account,
  isAuthenticated,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
} = storeToRefs(store);

const contractAddress = import.meta.env.VITE_MINT_TEA_CORE_CONTRACT;

/**
 * Check if our Wallet is Connected to 🦊 Metamask
 */
async function checkIfWalletIsConnected() {
  try {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log(`Please connect 🦊 Metamask to continue!`);
      return;
    }
    /* Get our Current Account */
    const accounts = await ethereum.request({ method: "eth_accounts" });
    /* Update our Current Account in the Store */
    if (accounts.length !== 0) {
      store.updateAccount(accounts[0]);
      await fetchTokens();
    }
  } catch (error) {
    console.log(error);
  }
}

/* Fetch NFT by Account Address */
async function fetchTokens() {
  if (account.value) {
    try {
      const authAccount = new authNFT();
      /* Ethereum */
      let ethereumTokens = await authAccount.fetchAccountNfts(1, account.value);
      store.addEthereumTokens(...ethereumTokens);
      let ethereumTestnetTokens = await authAccount.fetchAccountNfts(
        5,
        account.value
      );
      store.addEthereumTokens(...ethereumTestnetTokens);
      /* Polygon */
      let polygonTokens = await authAccount.fetchAccountNfts(
        137,
        account.value
      );
      store.addPolygonTokens(...polygonTokens);
      let polygonTestnetTokens = await authAccount.fetchAccountNfts(
        80001,
        account.value
      );
      store.addPolygonTokens(...polygonTestnetTokens);
      /* Optimism */
      // let optimismTokens = await authAccount.fetchAccountNfts(10, account.value);
      // store.addOptimismTokens(...optimismTokens);
      // let optimismTestnetTokens = await authAccount.fetchAccountNfts(69, account.value);
      // store.addOptimismTokens(...optimismTestnetTokens);
      /* Arbitrum */
      // let arbitrumTokens = await authAccount.fetchAccountNfts(42161, account.value);
      // store.addArbitrumTokens(...arbitrumTokens);
      // let arbitrumTestnetTokens = await authAccount.fetchAccountNfts(42161, account.value);
      // store.addArbitrumTokens(...arbitrumTestnetTokens);
    } catch (error) {
      store.setErrorMessage("Error getting tokens:", error);
      notyf.error(`Error fetching tokens, please refresh to try again!`);
    }
  }
}

onMounted(async () => {
  await checkIfWalletIsConnected();
});
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#content {
  position: relative;
  height: 100%;
  overflow: scroll;

  .main {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0;

    section#marketplace {
      color: #212121;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      overflow: scroll;

      .row {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        align-items: center;
        padding: 0;
      }

      .token-list {
        width: 100%;
        max-width: 1029px;
        display: inline-block;
        margin: 0 auto;
      }

      h2 {
        font-size: 1.8rem;
        text-align: center;
        margin-block-start: 0;
        margin-block-end: 0.2em;
      }

      .mint-button {
        color: #fff;
        background-color: #08d0a5;
        font-size: 18px;
        font-weight: bold;
        width: 100%;
        max-width: 360px;
        height: 55px;
        border: 0;
        padding-left: 87px;
        padding-right: 87px;
        border-radius: 10px;
        cursor: pointer;
      }

      .mint-button:disabled {
        background: #c6c6c6;
        color: #101010;
        cursor: not-allowed;
      }

      a {
        color: #1a1a1a;
        font-weight: bold;
        border-bottom: 1px solid #1a1a1a;
        text-decoration: none;

        &.author {
          padding: 6px 12px;
          border-radius: 8px;
          background-color: var(--gradient-100);
          color: var(--icon-color);
          font-size: 0.85rem;

          border-bottom: none;
        }
      }

      p {
        line-height: 1.7;
        margin-bottom: 20px;
        text-align: center;
      }
    }
  }
}

@media (min-width: 1024px) {
  .marketplace {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
