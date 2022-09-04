<template>
  <section id="content">
    <div class="main">
      <section id="marketplace">
        <h2>Marketplace</h2>
        <!-- Ethereum -->
        <h2 v-if="ethereumTokens.length > 0">Ethereum NFT Tokens</h2>
        {{ ethereumTokens }}
        <!-- <div v-if="ethereumTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in ethereumTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Polygon -->
        <h2 v-if="polygonTokens.length > 0">Polygon NFT Tokens</h2>
        {{ polygonTokens }}
        <!-- <div v-if="polygonTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in polygonTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Optimism -->
        <!-- {{ optimismTokens }}
        <h2 v-if="optimismTokens.length > 0">Optimism NFT Tokens</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in optimismTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Arbitrum -->
        <!-- {{ arbitrumTokens }}
        <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFT Tokens</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in arbitrumTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->
      </section>
    </div>
  </section>
</template>
<script setup>
import { onMounted } from "vue";

/* Import our Pinia Store */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Components */
import NftCard from "@/components/NftCard.vue";

/* Init Store Values and Methods */
const store = useStore();
const { ethereumTokens, polygonTokens, optimismTokens, arbitrumTokens } =
  storeToRefs(store);

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
/* Fetch new NFT audio/media by Category or Name */
async function fetchTokens() {
  try {
    const nfts = await store.fetchNFTs(
      "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      "shokumotsu-foodlove",
      "137"
    );

    console.log("nfts", nfts);

    const stylesEthereum = ["color: black", "background: grey"].join(";");
    console.log(
      "%c📻 Ethereum NFTs fetched : %s 📻",
      stylesEthereum,
      JSON.stringify(ethereumTokens.value)
    );

    const stylesPolygon = ["color: black", "background: purple"].join(";");
    console.log(
      "%c📻 Polygon NFTs fetched : %s 📻",
      stylesPolygon,
      JSON.stringify(polygonTokens.value)
    );

    const stylesOptimism = ["color: black", "background: red"].join(";");
    console.log(
      "%c📻 Optimism NFTs fetched : %s 📻",
      stylesOptimism,
      JSON.stringify(optimismTokens.value)
    );

    const stylesArbitrum = ["color: black", "background: yellow"].join(";");
    console.log(
      "%c📻 Arbitrum NFTs fetched : %s 📻",
      stylesArbitrum,
      JSON.stringify(arbitrumTokens.value)
    );
  } catch (error) {
    console.log(error);
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
