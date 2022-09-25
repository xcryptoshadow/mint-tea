<template>
  <main>
    <section id="search-bar">
      <div class="row">
        <div class="search">
          <button
            :class="!show ? 'show-button' : 'hide-button'"
            @click="show = !show"
          >
            {{ !show ? "Show" : "Hide" }}
          </button>
          <input
            type="text"
            v-model="contract"
            class="search-contract"
            placeholder="filter by contract"
          />
          <input
            type="text"
            v-model="name"
            class="search-name"
            placeholder="search by NFT name"
          />
          <select class="search-chain" v-model="chain">
            <option
              v-for="option in options"
              :value="option.label"
              :key="option.key"
            >
              {{ option.text }}
            </option>
          </select>
          <button
            class="search-button-name"
            @click="searchTokens('name')"
            title="Search"
          >
            search
          </button>
          <button
            v-if="showAdvancedSearch"
            class="show-advanced-button"
            @click="showAdvancedSearch = !showAdvancedSearch"
            title="Show advanced search"
          >
            <ArrowDownWhite class="arrow-down-small" />
          </button>
          <button
            v-if="!showAdvancedSearch"
            class="hide-advanced-button"
            @click="showAdvancedSearch = !showAdvancedSearch"
            title="Hide advanced search"
          >
            <ArrowDownWhite class="arrow-down-small" />
          </button>
          <button
            class="search-clear-button"
            @click="clearSearch()"
            title="Clear search"
          >
            X
          </button>
        </div>
        <!-- Advanced Search Options Panel -->
        <div v-if="showAdvancedSearch" class="advanced-search">
          <input
            type="text"
            v-model="contractFilter"
            class="search-advanced-contract"
            placeholder="filter out contract address"
          />
          <input
            type="text"
            v-model="tokenId"
            class="search-tokenId"
            placeholder="find duplicate by token id"
          />
          <button
            class="search-button-advanced"
            @click="searchTokens('tokenId')"
            title="Find duplicates"
            :disabled="!tokenId"
          >
            go
          </button>
          <input
            type="text"
            v-model="duplicateUrl"
            class="search-duplicates"
            placeholder="find duplicate NFTS by image url"
          />
          <button
            class="search-button-advanced"
            @click="searchTokens('image')"
            title="Find duplicates"
            :disabled="!duplicateUrl"
          >
            go
          </button>
        </div>
        <!-- END Advanced Search Options Panel -->
        <!-- Mobile Buttons Row -->
        <div class="mobile-buttons">
          <div class="search-mobile-buttons">
            <button
              :class="!show ? 'show-button-mobile' : 'hide-button-mobile'"
              @click="show = !show"
            >
              {{ !show ? "show" : "hide" }}
            </button>
            <button
              v-if="showAdvancedSearch"
              class="show-advanced-button-mobile"
              @click="showAdvancedSearch = !showAdvancedSearch"
              title="Show advanced search"
            >
              advanced
            </button>
            <button
              v-if="!showAdvancedSearch"
              class="hide-advanced-button-mobile"
              @click="showAdvancedSearch = !showAdvancedSearch"
              title="Hide advanced search"
            >
              advanced
            </button>
            <button
              class="search-button-name-mobile"
              @click="searchTokens('name')"
              title="Search"
            >
              search name
            </button>
          </div>
          <div class="search-mobile-buttons">
            <button
              class="search-button-advanced-mobile"
              @click="searchTokens('tokenId')"
              title="Find duplicates"
              :disabled="!tokenId"
            >
              search id
            </button>
            <button
              class="search-button-advanced-mobile"
              @click="searchTokens('image')"
              title="Find duplicates"
              :disabled="!duplicateUrl"
            >
              search url
            </button>
            <button
              class="search-clear-button-mobile"
              @click="clearSearch()"
              title="Clear search"
            >
              clear
            </button>
          </div>
        </div>
      </div>
      <!-- END Mobile Buttons Row -->
    </section>
    <Transition name="slide-fade">
      <section v-show="show" id="search-results">
        <div class="search-results-row">
          <h2>Search Results</h2>
          <div
            v-if="(!loading && errorCode) || errorStatus || errorMessage"
            class="row error-box"
          >
            <!-- <div class="error-status">{{ errorCode }} : {{ errorStatus }}</div> -->
            <div class="error-message">
              {{ errorMessage
              }}<template v-if="errorStatus === 404"
                ><br />Please make sure you have entered the correct contract
                address<br />
                or try a different name or image url</template
              >
            </div>
          </div>
          <div v-if="searchResults" class="row token-list">
            <template v-for="token in searchResults" :key="token.token_id">
              <SearchCard :token="token" />
            </template>
            <div v-if="loading" class="loading-bar">...loading</div>
          </div>
        </div>
      </section>
    </Transition>
    <section id="marketplace">
      <div class="row-header">
        <h2>
          <span class="mint-black">minty</span>fresh
          <ArrowDownWhite class="arrow-down" />
        </h2>
      </div>
      <div class="row token-list">
        <template v-for="token in trendingTokens" :key="token.tokenId">
          <NftCard :token="token" />
        </template>
      </div>
      <div class="row-header">
        <h2>
          <span class="mint-black">top</span>pics
          <ArrowDownWhite class="arrow-down" />
        </h2>
      </div>
      <div class="row token-list">
        <template v-for="token in topTokens" :key="token.tokenId">
          <NftCard :token="token" />
        </template>
      </div>
      <div class="row-header">
        <h2>
          <span class="mint-black">trendy</span>
          <ArrowDownWhite class="arrow-down" />
        </h2>
      </div>
      <div class="row token-list">
        <template v-for="token in latestTokens" :key="token.tokenId">
          <NftCard :token="token" />
        </template>
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import SVG */
import ArrowDownWhite from "../assets/svgs/ArrowDownWhite.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";
import SearchCard from "@/components/SearchCard.vue";

/* Init Store Values and Methods */
const store = useStore();
const {
  loading,
  errorCode,
  errorStatus,
  errorMessage,
  searchResults,
  topTokens,
  latestTokens,
  trendingTokens,
} = storeToRefs(store);

const chain = ref("all");
const options = ref([
  { value: 0, label: "all", text: "all" },
  { value: 1, label: "ethereum", text: "ethereum" },
  // { value: 5, label: "ethereum-testnet", text: "Ethereum Testnet" },
  { value: 137, label: "polygon", text: "polygon" },
  // { value: 80001, label: "polygon-testnet", text: "Mumbai Testnet" },
  { value: 10, label: "optimism", text: "optimism" },
  // { value: 69, label: "optimism-testnet", text: "Optimism Testnet" },
  { value: 42161, label: "arbitrum", text: "arbitrum" },
  // { value: 421611, label: "arbitrum-testnet", text: "Arbitrum Testnet" },
  { value: 43114, label: "avalanche", text: "avalanche" },
  // { value: 421611, label: "avalanche-testnet", text: "Arbitrum Testnet" },
]);

/* Show Search Results Panel */
const show = ref(false);
const showAdvancedSearch = ref(false);

/* 🦸🏻 NFT Port Search Defaults */
const contract = ref("");
const contractFilter = ref("");
const tokenId = ref(null);
const name = ref("");
const image = ref("");
const duplicateUrl = ref("");
const sort_order = ref("asc");
const order_by = ref("relevance");
const page_size = ref(50);
const page_number = ref(1);
const threshold = ref(0.1);

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
 * Fetch NFTs using 🦸🏻 NFT Port API for our Marketplace Example
 */
async function fetchTokens() {
  if (topTokens.value.length === 0) {
    try {
      let topTokens = await store.contractNftSearch(
        "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7",
        "ethereum",
        "metadata",
        "true",
        10,
        1
      );
      if (topTokens.nfts && topTokens.total > 0) {
        store.addTopTokens(...topTokens.nfts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (latestTokens.value.length === 0) {
    try {
      let latestTokens = await store.contractNftSearch(
        "0x1A92f7381B9F03921564a437210bB9396471050C",
        "ethereum",
        "metadata",
        "true",
        15,
        1
      );
      if (latestTokens.nfts && latestTokens.total > 0) {
        store.addLatestTokens(...latestTokens.nfts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (trendingTokens.value.length === 0) {
    try {
      let trendingTokens = await store.contractNftSearch(
        "0x19b86299c21505cdf59cE63740B240A9C822b5E4",
        "ethereum",
        "metadata",
        "true",
        10,
        1
      );
      if (trendingTokens.nfts) {
        store.addTrendingTokens(...trendingTokens.nfts);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * NFTPort Search
 */
/* Fetch new NFT audio/media by Category or Name */
async function searchTokens(type) {
  /* Set Loading */
  store.setLoading(true);

  /* Clear our last response from Pinia Store */
  store.setErrorCode(null);
  store.setErrorStatus(null);
  store.setErrorMessage("");

  /* Open the Search Panel */
  if (show.value === false) {
    show.value = true;
  }

  console.log("Search type:", type);

  if (type === "name") {
    console.log("contract:", contract.value);
    console.log("name:", name.value);
    console.log("chain:", chain.value);
    console.log("sort_order:", sort_order.value);
    console.log("order_by:", order_by.value);
    console.log("page_size:", page_size.value);
    console.log("page_number:", page_number.value);

    /* Name Search */
    try {
      const results = await store.searchNFTs(
        contract.value,
        name.value,
        chain.value,
        sort_order.value,
        order_by.value,
        page_size.value,
        page_number.value
      );

      const stylesResults = ["color: black", "background: grey"].join(";");
      console.log(
        "%c🦸🏻 NFT Port Search by Name fetched : %s",
        stylesResults,
        JSON.stringify(results)
      );

      if (results.search_results && results.search_results.length > 0) {
        store.addSearchResults(...results.search_results);
      }
      store.setLoading(false);
    } catch (error) {
      console.log(error);
      store.setLoading(false);
    }
  } else if (type === "image") {
    console.log("Contract Address :", contract.value);
    console.log("Contract Filter Address :", contractFilter.value);
    console.log("Duplicate Url :", duplicateUrl.value);
    console.log("Page Size :", page_size.value);
    console.log("Page Number :", page_number.value);
    console.log("Threshold :", page_number.value);
    /* Image Search */
    try {
      const results = await store.searchNFTImage(
        contractFilter.value,
        duplicateUrl.value,
        page_size.value,
        page_number.value,
        threshold.value
      );

      const stylesResults = ["color: black", "background: grey"].join(";");
      console.log(
        "%c🦸🏻 NFT Port Search by Image URL : %s",
        stylesResults,
        JSON.stringify(results, 0, 4)
      );

      if (
        results.is_similar &&
        results.similar_nfts &&
        results.similar_nfts.length > 0
      ) {
        store.addSearchResults(...results.search_results);
      }
      if (!results.is_similar) {
        store.setErrorCode(404);
        store.setErrorStatus("NOT_FOUND");
        store.setErrorMessage("No similar results found!");
      }
      store.setLoading(false);
    } catch (error) {
      console.log(error);
      store.setLoading(false);
    }
  } else if (type === "tokenId") {
    console.log("chain:", chain.value);
    console.log("contract:", contract.value);
    console.log("contractFilter:", contractFilter.value);
    console.log("name:", name.value);
    console.log("tokenId:", tokenId.value);
    console.log("page_size:", page_size.value);
    console.log("page_number:", page_number.value);
    /* Token Id Search */
    try {
      const results = await store.searchNFTTokenId(
        contract.value,
        contractFilter.value,
        tokenId.value,
        name.value,
        chain.value,
        page_size.value,
        page_number.value,
        threshold.value
      );

      const stylesResults = ["color: black", "background: grey"].join(";");
      console.log(
        "%c🦸🏻 NFT Port Search by Token Id : %s",
        stylesResults,
        JSON.stringify(results, 0, 4)
      );

      if (
        results.is_similar &&
        results.similar_nfts &&
        results.similar_nfts.length > 0
      ) {
        store.addSearchResults(...results.search_results);
      }
      if (!results.is_similar) {
        store.setErrorCode(404);
        store.setErrorStatus("NOT_FOUND");
        store.setErrorMessage("No similar results found!");
      }
      store.setLoading(false);
    } catch (error) {
      console.log(error);
      store.setLoading(false);
    }
  }
}

/* Clear our Search Results */
function clearSearch() {
  store.setErrorCode(null);
  store.setErrorStatus(null);
  store.setErrorMessage("");
  chain.value = "all";
  contract.value = "";
  contractFilter.value = "";
  tokenId.value = "";
  name.value = "";
  image.value = "";
  duplicateUrl.value = "";
  sort_order.value = "asc";
  order_by.value = "relevance";
  page_size.value = 50;
  page_number.value = 1;
}

onMounted(async () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  await checkIfWalletIsConnected();
  await fetchTokens();
});
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

main {
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    269.69deg,
    #fbe2ff 0.3%,
    rgba(251, 226, 255, 0) 99.77%
  );
}
section#search-bar {
  color: $mint-black;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  max-width: 1279px;
  display: inline-block;
  margin: 0 auto;
  padding-bottom: 5px;

  @include breakpoint($break-md) {
    margin: 1em auto;
    padding: 0;
  }
  @include breakpoint($break-sm) {
    margin: 0 auto;
    padding: 0;
  }
  @include breakpoint($break-xs) {
    margin: 0 auto;
    padding: 0;
  }

  .row {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 0;

    h2 {
      font-size: 1.8rem;
      text-align: center;
      margin-block-start: 0;
      margin-block-end: 0.2em;
    }

    .search {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;
      align-items: center;
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 0 auto;
        padding-left: 3px;
      }
      @include breakpoint($break-md) {
        width: 100%;
        height: auto;
        margin: 0 auto;
      }
      @include breakpoint($break-sm) {
        width: 100%;
        flex-direction: column;
        height: auto;
        margin: 0 auto;
      }
      @include breakpoint($break-xs) {
        width: 100%;
        flex-direction: column;
        height: auto;
        margin: 0 auto;
      }
      select.search-chain {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        width: 200px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        cursor: pointer;
        @include breakpoint($break-md) {
          width: 180px;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
      }
      select.search-chain::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      select.search-chain:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      /* Filter by Contract */
      input.search-contract {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        min-width: 400px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-lg) {
          min-width: 256px;
        }
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
      }
      input.search-contract::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-contract:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      /* Search by Token Name or Description */
      input.search-name {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        min-width: 220px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
      }
      input.search-name::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-name:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      /* Search by Token Name or Description */
      input.search-image {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        width: auto;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1%;
        }
      }
      input.search-image::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-image:focus {
        border: 1px solid $mint-black;
        outline: none;
      }
      /* Desktopn & Tablet Versions */
      .search-button-name {
        color: $white;
        background-color: $mint-blue;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        min-width: 100px;
        padding: 10px;
        text-align: center;
        margin: 0 5px;
        transition: 0.4s;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-black;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }
      .show-button {
        color: $white;
        background-color: $mint-blue;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        min-width: 70px;
        padding: 10px;
        text-align: center;
        margin-right: 5px;
        transition: 0.4s;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-black;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }
      .hide-button {
        color: $white;
        background-color: $mint-black;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        min-width: 70px;
        padding: 10px;
        text-align: center;
        margin-right: 5px;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-blue;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }

      .show-advanced-button {
        color: $white;
        background-color: $mint-black;
        border: 0;
        border-radius: 100px;
        letter-spacing: 1px;
        font-size: 14px;
        padding: 7px 9px 4px 9px;
        text-align: center;
        margin: 0;
        transition: 0.4s;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-blue;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
        .arrow-down-small {
          width: 15px;
          height: 15px;
          img,
          svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
            overflow: hidden;
          }
        }
      }
      .hide-advanced-button {
        color: $white;
        background-color: $mint-blue;
        border: 0;
        border-radius: 100px;
        letter-spacing: 1px;
        font-size: 14px;
        padding: 7px 9px 4px 9px;
        text-align: center;
        margin: 0;
        transition: 0.4s;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-black;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
        .arrow-down-small {
          width: 15px;
          height: 15px;
          -webkit-filter: invert(1); /* safari 6.0 - 9.0 */
          filter: invert(1);
          img,
          svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
            overflow: hidden;
          }
        }
      }
      .search-clear-button {
        color: $white;
        background-color: $mint-orange;
        border-radius: 100px;
        border: 0;
        font-size: 14px;
        padding: 9px 9px 7px 9px;
        text-align: center;
        margin: 0 5px 0 5px;
        transition: 0.4s;
        cursor: pointer;
        &:hover {
          color: $mint-black;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }
    }
    .mobile-buttons {
      width: 100%;
      padding-bottom: 10px;
      .search-mobile-buttons {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        align-items: center;
        margin: 5px auto 5px;
        width: 80%;
        @include breakpoint($break-md) {
          width: 100%;
        }
        @include breakpoint($break-sm) {
          width: 100%;
        }
        @include breakpoint($break-xs) {
          width: 100%;
        }

        .search-button-name-mobile {
          color: $white;
          background-color: $mint-blue;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 100px;
          padding: 10px;
          text-align: center;
          margin: 0 5px;
          transition: 0.4s;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-black;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
          }
        }

        .search-button-advanced-mobile {
          color: $white;
          background-color: $mint-black;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 25px;
          padding: 10px;
          text-align: center;
          margin: 0 0 0 5px;
          transition: 0.4s;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-blue;
          }
          @include breakpoint($break-md) {
            display: inline-block;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
          }
        }
        .search-button-advanced-mobile:disabled {
          background: #c6c6c6;
          color: #101010;
          cursor: not-allowed;
        }

        .show-advanced-button-mobile {
          color: $white;
          background-color: $mint-black;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 100px;
          padding: 10px;
          text-align: center;
          margin: 0 5px;
          transition: 0.4s;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-blue;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          .arrow-down-small {
            width: 15px;
            height: 15px;
            img,
            svg {
              width: 100%;
              height: 100%;
              object-fit: contain;
              overflow: hidden;
            }
          }
        }

        .hide-advanced-button-mobile {
          color: $white;
          background-color: $mint-black;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 100px;
          padding: 10px;
          text-align: center;
          margin: 0 5px;
          transition: 0.4s;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-blue;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          .arrow-down-small {
            width: 15px;
            height: 15px;
            -webkit-filter: invert(1); /* safari 6.0 - 9.0 */
            filter: invert(1);
            img,
            svg {
              width: 100%;
              height: 100%;
              object-fit: contain;
              overflow: hidden;
            }
          }
        }

        /* Mobile Versions */
        .show-button-mobile {
          color: $white;
          background-color: $mint-black;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 70px;
          padding: 10px;
          text-align: center;
          margin-right: 5px;
          transition: 0.4s;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-blue;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
        }
        .hide-button-mobile {
          color: $white;
          background-color: $mint-black;
          border: 0;
          border-radius: 30px;
          letter-spacing: 1px;
          font-size: 14px;
          min-width: 70px;
          padding: 10px;
          text-align: center;
          margin-right: 5px;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-blue;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
        }
        .search-clear-button-mobile {
          color: $white;
          background-color: $mint-orange;
          border-radius: 100px;
          border: 0;
          font-size: 14px;
          min-width: 70px;
          padding: 10px;
          margin: 0 5px 0 5px;
          text-align: center;
          cursor: pointer;
          display: none;
          &:hover {
            color: $mint-black;
          }
          @include breakpoint($break-md) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-sm) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
          @include breakpoint($break-xs) {
            display: inline-block;
            margin: 0 5px 0 5px;
          }
        }
      }
    }

    /*Advanced Serach Options */
    .advanced-search {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;
      align-items: center;
      margin: 10px auto;
      height: auto;
      @include breakpoint($break-lg) {
        margin: 10px auto;
        padding-left: 3px;
      }
      @include breakpoint($break-md) {
        margin: 0 auto;
      }
      @include breakpoint($break-sm) {
        flex-direction: column;
        margin: 0 auto;
      }
      @include breakpoint($break-xs) {
        flex-direction: column;
        margin: 0 auto;
      }
      /* Filter by Contract */
      input.search-advanced-contract {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        min-width: 330px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-lg) {
          min-width: 256px;
        }
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
      }
      input.search-advanced-contract::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-advanced-contract:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      /* Search by Token Name or Description */
      input.search-tokenId {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        min-width: 220px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1% 1% 1%;
        }
      }
      input.search-tokenId::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-tokenId:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      /* Search by Token Name or Description */
      input.search-duplicates {
        color: $mint-blue;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 13px;
        min-width: 330px;
        padding: 11px 10px 9px;
        margin: 0 5px;
        text-align: center;
        @include breakpoint($break-md) {
          min-width: 200px;
        }
        @include breakpoint($break-sm) {
          width: 80%;
          margin: 0 1%;
        }
        @include breakpoint($break-xs) {
          width: 80%;
          margin: 0 1%;
        }
      }
      input.search-duplicates::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-duplicates:focus {
        border: 1px solid $mint-black;
        outline: none;
      }

      .search-button-advanced {
        color: $white;
        background-color: $mint-black;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        min-width: 25px;
        padding: 10px;
        text-align: center;
        margin: 0 0 0 5px;
        transition: 0.4s;
        cursor: pointer;
        display: inline-block;
        &:hover {
          color: $mint-blue;
        }
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }
      .search-button-advanced:disabled {
        background: #c6c6c6;
        color: #101010;
        cursor: not-allowed;
      }
    }
  }
}
section#search-results {
  color: $white;
  background: $grey-90;
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 430px;
  padding: 30px 0 20px;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    overflow: hidden;
  }

  .search-logo {
    position: fixed;
    top: 60px;
    left: 30px;
  }
  .search-results-row {
    width: 100%;
    max-width: 1279px;
    display: inline-block;
    margin: 0 auto;

    h2 {
      font-size: 1.4rem;
      text-align: center;
      text-decoration: none;
    }

    .token-list {
      width: 100%;
      max-width: 1280px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
      margin: 20px auto 0;
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 20px auto 0;
        grid-template-columns: repeat(4, 1fr);
      }
      @include breakpoint($break-md) {
        width: 100%;
        margin: 20px auto 0;
        grid-template-columns: repeat(4, 1fr);
      }
      @include breakpoint($break-sm) {
        width: 100%;
        margin: 20px auto 0;
        grid-template-columns: repeat(1, 1fr);
      }
      @include breakpoint($break-xs) {
        width: 100%;
        margin: 20px auto 0;
        grid-template-columns: repeat(1, 1fr);
      }

      .loading-bar {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
    }

    .error-box {
      width: auto;
      display: inline-block;
      margin: 5px auto;
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      justify-content: flex-start;

      .error-status {
        width: 100%;
        color: #fff;
        width: auto;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: left;
      }
      .error-message {
        color: #fff;
        width: 100%;
        font-size: 15px;
        font-weight: normal;
        text-align: center;
      }
    }
  }
}
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
section#marketplace {
  width: 100%;
  color: $mint-black;
  background: $mint-blue;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding: 3em 0;
  border-top: 1px solid $mint-black;

  .row-header {
    width: 100%;
    max-width: 1280px;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    justify-content: center;
    align-items: center;
    margin: 25px 0;
    @include breakpoint($break-md) {
      width: 83%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 85%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 85%;
      margin: 0 auto;
    }
    h2 {
      width: 100%;
      color: $white;
      font-style: normal;
      font-weight: 700;
      font-size: 36px;
      line-height: 42px;
      text-align: left;
      margin: 0 0 20px 20px;
      .mint-black {
        color: $mint-black;
      }
      .arrow-down {
        margin: 10px 0 -10px 10px;
      }
    }
  }
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
    max-width: 1280px;
    display: inline-block;
    margin: 0 auto;
    @include breakpoint($break-lg) {
      width: 80%;
      margin: 0 auto;
    }
    @include breakpoint($break-md) {
      width: 86%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 85%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 80%;
      margin: 0 auto;
    }
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
