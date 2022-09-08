<template>
  <main>
    <section id="marketplace">
      <div class="row">
        <h2>Marketplace</h2>
        <div class="search">
          <select class="search-chain" v-model="chainId">
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
            class="search-contract"
            placeholder="Filter by contract"
            @input="searchTokens()"
          />
          <input
            type="text"
            v-model="name"
            class="search-name"
            placeholder="Search by name"
            @input="searchTokens()"
          />
          <input
            type="text"
            v-model="image"
            class="search-image"
            placeholder="Search by image url"
            @input="searchTokens()"
          />
          <button class="search-clear-button" @click="clearSearch()">X</button>
        </div>
      </div>

      <!-- Filtered List -->
      <div v-if="searchResults && searchResults.length > 0" class="row">
        <h2>Token Search Results</h2>
        <div class="row token-list">
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

const chainId = ref("ethereum");
const options = ref([
  { value: 1, label: "ethereum", text: "Ethereum Mainnet" },
  { value: 5, label: "ethereum-testnet", text: "Ethereum Testnet" },
  { value: 137, label: "polygon", text: "Polygon Mainnet" },
  { value: 80001, label: "polygon-testnet", text: "Mumbai Testnet" },
  { value: 10, label: "optimism", text: "Optimism Mainnet" },
  { value: 69, label: "optimism-testnet", text: "Optimism Testnet" },
  { value: 42161, label: "arbitrum", text: "Arbitrum Mainnet" },
  { value: 421611, label: "arbitrum-testnet", text: "Arbitrum Testnet" },
  { value: 0, label: "all", text: "All" },
]);

const contract = ref("");
const name = ref("");
const image = ref("");
const sort_order = ref("desc");
const order_by = ref("relevance");
const page_size = ref(50);
const page_number = ref(1);

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
  console.log("chainId:", chainId.value);
  console.log("contract:", contract.value);
  console.log("name:", name.value);
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
    //       Body
    // application/json
    // response
    // string
    // required
    // Response status, either OK or NOK.

    // Allowed values:
    // OK
    // NOK
    // search_results
    // array[TextSearchNft]
    // chain
    // string
    // required
    // Blockchain where the NFT has been minted.

    // Allowed values:
    // polygon
    // ethereum
    // contract_address
    // string
    // required
    // The contract address of the NFT.

    // token_id
    // string
    // required
    // A unique uint256 ID inside the contract. The contract address and token ID pair is a globally unique and fully-qualified identifier for a specific NFT on chain.

    // cached_file_url
    // string
    // required
    // Cached file (image, video, etc) in NFTPort's cloud with no access restrictions and without IPFS issues.

    // name
    // string
    // required
    // Name of the NFT in the metadata.

    // description
    // string
    // required
    // Description of the NFT in the metadata.

    // mint_date
    // string
    // Date when the NFT was minted (ISO).
    const stylesResults = ["color: black", "background: grey"].join(";");
    console.log(
      "%c📻 NFT Port Search fetched : %s",
      stylesResults,
      JSON.stringify(results)
    );
    if (results && results.length > 0) store.addSearchResults(...results);
  } catch (error) {
    console.log(error);
  }
}

/* Clear our Search Results */
async function clearSearch() {
  console.log("Clear Search Clicked!");
  await store.clearSearchResults();
}

onMounted(async () => {
  await checkIfWalletIsConnected();
  // await fetchTokens();
});
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#marketplace {
  color: $mint-black;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  max-width: 1279px;
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

  .search {
    select.search-chain {
      color: $mint-black;
      background-color: #fdfdfd;
      border: 0;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      letter-spacing: 1px;
      font-size: 13px;
      width: 200px;
      padding: 10px;
      text-align: center;
    }
    select.search-chain::placeholder {
      color: #a8a8a8;
      letter-spacing: 1px;
    }
    select.search-chain:focus {
      border: 0;
      outline: none;
    }

    /* Filter by Contract */
    input.search-contract {
      color: $mint-black;
      background-color: #fdfdfd;
      border: 0;
      border-radius: 0;
      letter-spacing: 1px;
      font-size: 13px;
      width: auto;
      padding: 11px 10px;
      text-align: center;
    }
    input.search-contract::placeholder {
      color: #a8a8a8;
      letter-spacing: 1px;
    }
    input.search-contract:focus {
      border: 0;
      outline: none;
    }

    /* Search by Token Name or Description */
    input.search-name {
      color: $mint-black;
      background-color: #fdfdfd;
      border: 0;
      border-radius: 0;
      letter-spacing: 1px;
      font-size: 13px;
      width: auto;
      padding: 11px 10px;
      text-align: center;
    }
    input.search-name::placeholder {
      color: #a8a8a8;
      letter-spacing: 1px;
    }
    input.search-name:focus {
      border: 0;
      outline: none;
    }

    /* Search by Token Name or Description */
    input.search-image {
      color: $mint-black;
      background-color: #fdfdfd;
      border: 0;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      letter-spacing: 1px;
      font-size: 13px;
      width: auto;
      padding: 11px 10px;
      text-align: center;
    }
    input.search-image::placeholder {
      color: #a8a8a8;
      letter-spacing: 1px;
    }
    input.search-image:focus {
      border: 0;
      outline: none;
    }

    .search-clear-button {
      color: $white;
      background-color: $mint-black;
      border: 0;
      border-radius: 5px;
      letter-spacing: 1px;
      font-size: 14px;
      width: auto;
      padding: 10px;
      text-align: center;
      margin-left: 5px;
      cursor: pointer;
    }
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
    background-color: $mint-black;
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
    color: $mint-orange;
    cursor: not-allowed;
  }

  a {
    color: $mint-black;
    font-weight: bold;
    border-bottom: 1px solid #1a1a1a;
    text-decoration: none;
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
