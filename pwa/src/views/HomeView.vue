<template>
  <main>
    <article>
      <section id="content">
        <!-- Tab One Main NFT Metadata -->
        <div class="form-container">
          <h2>1. Create NFT</h2>
          <div class="input-row">
            <input type="text" placeholder="Token ID" v-model="tokenId" />
          </div>
          <div class="input-row hidden">
            <input type="text" placeholder="Content ID" v-model="cid" />
          </div>
          <div class="input-row">
            <input type="text" placeholder="Name" v-model="name" />
          </div>
          <div class="input-row">
            <input
              type="text"
              placeholder="Enter a description"
              v-model="description"
            />
          </div>
          <div class="input-row">
            <input
              type="text"
              placeholder="Image Url"
              v-model="imageUrl"
              readonly
            />
          </div>
          <div class="input-row">
            <input
              type="text"
              placeholder="Audio/Video Type"
              v-model="audioVideoType"
              readonly
            />
          </div>
          <div class="input-row">
            <input
              type="text"
              placeholder="File Size"
              v-model="size"
              readonly
            />
          </div>
          <div class="input-row hidden">
            <input
              type="text"
              placeholder="Created"
              v-model="createdAt"
              readonly
            />
          </div>
          <div class="input-row hidden">
            <input
              type="text"
              placeholder="Add an external link"
              v-model="externalUrl"
            />
          </div>
          <div class="button-container">
            <button
              v-if="!tokenId"
              :disabled="!account"
              class="mint-button"
              @click="mintNFT()"
            >
              Mint
            </button>
          </div>
        </div>
      </section>
    </article>
    <aside><TheWelcome /></aside>
  </main>
</template>
<script setup>
import { onMounted } from "vue";
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
/* Components */
import TheWelcome from "@/components/TheWelcome.vue";

// Init Store
const store = useStore();
// Store Values and Methods
const {
  loading,
  account,
  balance,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
} = storeToRefs(store);

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
    if (accounts.length !== 0) store.updateAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
}

/* Fetch new NFT audio/media by Category or Name */
async function fetchData() {
  try {
    await store.fetchNFTs(
      "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      "shokumotsu-foodlove",
      "137"
    );

    /* Console log with some style */
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

onMounted(() => {
  fetchData();
  checkIfWalletIsConnected();
});
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#content {
  position: relative;
  height: 100%;

  .form-container {
    display: flex;
    width: 99%;
    height: 505px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 4px solid var(--gradient-100);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    padding: 30px 0 30px 0;

    h2 {
      font-size: 1.4rem;
      line-height: 1.5rem;
      text-align: center;
      padding-bottom: 2px;
      text-decoration: none;
      border-bottom: 1px solid;
      margin: 0 auto 10px;
    }
  }

  input {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 2px solid var(--gradient-100);
    border-radius: 10px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 240px;
    margin-bottom: 10px;
    padding: 10px;
    text-align: center;
  }

  input::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }

  input:read-only {
    color: #1a1a1a;
    border: 2px dashed #e0e0e0;
    letter-spacing: 2px;
    cursor: not-allowed;
  }

  input:focus {
    border: 2px solid #2bb5f0;
    outline: none;
  }

  .select-row {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .grey {
    color: #a8a8a8 !important;
    letter-spacing: 1px;
  }

  textarea {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 2px solid var(--gradient-100);
    border-radius: 10px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 300px;
    margin-bottom: 10px;
    padding: 10px;
    text-align: center;
  }

  textarea::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }

  textarea:focus {
    border: 2px solid #e9429b;
    outline: none;
  }

  .input-row {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .hidden {
    display: none;
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
    padding-left: 97px;
    padding-right: 97px;
    border-radius: 10px;
    cursor: pointer;
  }

  .mint-button:disabled {
    background: #c6c6c6;
    color: #101010;
    cursor: not-allowed;
  }
}
</style>
