<template>
  <main>
    <section id="marketplace">
      <div class="row">
        <h2>Marketplace</h2>
        <div class="search">
          <select v-model="chainId">
            <option
              v-for="option in options"
              :value="option.label"
              :key="option.key"
            >
              {{ option.text }}
            </option>
          </select>
          <input
            type="text"
            v-model="contract"
            placeholder="Filter by contract"
            @input="searchTokens()"
          />
          <input
            type="text"
            v-model="name"
            placeholder="Search by name"
            @input="searchTokens()"
          />
          <input
            type="text"
            v-model="image"
            placeholder="Search by image url"
            @input="searchTokens()"
          />
          <button
            :disabled="searchResults.length === 0"
            class="clear-button"
            @click="clearSearch()"
          >
            X
          </button>
        </div>
      </div>

      <!-- Filtered List -->
      {{ searchResults }}
      <div v-if="searchResults.length > 0" class="row">
        <h2>Token Search Results</h2>
        <div v-if="searchResults.length > 0" class="row token-list">
          <template v-for="token in searchResults" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>

      <!-- Ethereum -->
      <div class="row">
        <h2 v-if="ethereumTokens.length > 0">Ethereum NFT Tokens</h2>
        <div v-if="ethereumTokens.length > 0" class="row token-list">
          <template v-for="token in ethereumTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>

      <!-- Polygon -->
      <div class="row">
        <h2 v-if="polygonTokens.length > 0">Polygon NFT Tokens</h2>
        <div v-if="polygonTokens.length > 0" class="row token-list">
          <template v-for="token in polygonTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>

      <!-- Optimism -->
      <div class="row">
        <h2 v-if="optimismTokens.length > 0">Optimism NFT Tokens</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <template v-for="token in optimismTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>

      <!-- Arbitrum -->
      <div class="row">
        <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFT Tokens</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <template v-for="token in arbitrumTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";

/* Import our Pinia Store */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* NFT Port Service */
import nftPort from "../services/nftPort.js";

/* Components */
import NftCard from "@/components/NftCard.vue";

/* Init Store Values and Methods */
const store = useStore();
const {
  // searchChainId,
  // searchContract,
  // searchName,
  // searchImage,
  searchResults,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
} = storeToRefs(store);

const contract = ref("");
const name = ref("");
const image = ref("");
const sort_order = ref("desc");
const order_by = ref("relevance");
const page_size = ref(50);
const page_number = ref(1);

const chainId = ref("all");
const options = ref([
  { value: 0, label: "all", text: "All" },
  { value: 1, label: "ethereum", text: "Ethereum Mainnet" },
  { value: 5, label: "ethereum-testnet", text: "Ethereum Testnet" },
  { value: 137, label: "polygon", text: "Polygon Mainnet" },
  { value: 80001, label: "polygon-testnet", text: "Mumbai Testnet" },
  { value: 10, label: "optimism", text: "Optimism Mainnet" },
  { value: 69, label: "optimism-testnet", text: "Optimism Testnet" },
  { value: 42161, label: "arbitrum", text: "Arbitrum Mainnet" },
  { value: 421611, label: "arbitrum-testnet", text: "Arbitrum Testnet" },
]);

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
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * NFTPort Search
 */
/* Fetch new NFT audio/media by Category or Name */
async function searchTokens() {
  console.log("name:", name.value);

  if (name.value.length > 3) {
    console.log("contract:", contract.value);
    console.log("chainId:", chainId.value);
    console.log("sort_order:", sort_order.value);
    console.log("order_by:", order_by.value);
    console.log("page_size:", page_size.value);
    console.log("page_number:", page_number.value);

    try {
      /* Init NftPort Class */
      const nftPortApi = new nftPort();
      let results = await nftPortApi.nftSearch(
        name.value,
        contract.value,
        chainId.value,
        sort_order.value,
        order_by.value,
        page_size.value,
        page_number.value
      );
      const stylesResults = ["color: black", "background: grey"].join(";");
      console.log(
        "%c📻 NFT Port Search fetched : %s",
        stylesResults,
        JSON.stringify(results)
      );
      if (results.length > 0) store.addSearchResults(...results);
    } catch (error) {
      console.log(error);
    }
  }
}

/* Clear our Search Results */
function clearSearch() {
  store.clearSearchResults();
}

onMounted(async () => {
  await checkIfWalletIsConnected();
  await searchTokens();
});
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#marketplace {
  color: #212121;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1080px;
  display: inline-block;
  margin: 0 auto;
  overflow: scroll;

  .row {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .token-list {
    width: 100%;
    max-width: 1080px;
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

@media (min-width: 1024px) {
  .marketplace {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
