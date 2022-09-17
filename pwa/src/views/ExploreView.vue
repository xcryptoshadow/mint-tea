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
          <select class="search-chain" v-model="chain">
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
          />
          <input
            type="text"
            v-model="name"
            class="search-name"
            placeholder="Search by name"
            @input="searchTokens('name')"
          />
          <input
            type="text"
            v-model="image"
            class="search-image"
            placeholder="Search by image url"
            @input="searchTokens('image')"
          />
          <button
            :class="!show ? 'show-button-mobile' : 'hide-button-mobile'"
            @click="show = !show"
          >
            {{ !show ? "Show" : "Hide" }}
          </button>
          <button class="search-clear-button" @click="clearSearch()">X</button>
        </div>
      </div>
    </section>
    <Transition name="slide-fade">
      <section v-show="show" id="search-results">
        <div class="search-results-row">
          <h2>Search Results</h2>
          <div class="row token-list">
            {{ searchResults }}
            <template v-for="token in searchResults" :key="token.tokenId">
              <NftCard
                v-if="token.metadata && token.metadata.image"
                :token="token"
              />
            </template>
          </div>
        </div>
      </section>
    </Transition>
    <section id="marketplace">
      <div class="row">
        <div class="row-header">
          <h2>
            <span class="mint-black">minty</span>fresh
            <ArrowDownWhite class="arrow-down" />
          </h2>
        </div>
        <div class="row token-list">
          <template v-for="token in latestTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>
      <div class="row">
        <div class="row-header">
          <h2>
            <span class="mint-black">top</span>pics
            <ArrowDownWhite class="arrow-down" />
          </h2>
        </div>
        <div class="row token-list">
          <template v-for="token in topTokens" :key="token.tokenId">
            <NftCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>
      <div class="row">
        <div class="row-header">
          <h2>
            <span class="mint-black">trendy</span>
            <ArrowDownWhite class="arrow-down" />
          </h2>
        </div>
        <div class="row token-list">
          <template v-for="token in anneTokens" :key="token.tokenId">
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

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import SVG */
import ArrowDownWhite from "../assets/svgs/ArrowDownWhite.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";

/* Init Store Values and Methods */
const store = useStore();
const { searchResults, topTokens, latestTokens, anneTokens } =
  storeToRefs(store);

const chain = ref("all");
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

const show = ref(false);
const contract = ref("");
const name = ref("");
const image = ref("");
const sort_order = ref("asc");
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
async function searchTokens(type) {
  console.log("Search type:", type);
  console.log("contract:", contract.value);
  console.log("name:", name.value);
  console.log("chain:", chain.value);
  console.log("image:", image.value);
  console.log("sort_order:", sort_order.value);
  console.log("order_by:", order_by.value);
  console.log("page_size:", page_size.value);
  console.log("page_number:", page_number.value);

  if (type === "name") {
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
      console.log("%c📻 NFT Port Search fetched : %s", stylesResults, results);
      if (results.error) {
        console.log("Error", results.error);
      }
      if (results.search_results && results.search_results.length > 0) {
        store.addSearchResults(...results.search_results);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    /* Image Search */
    try {
      const results = await store.searchNFTs(
        contract.value,
        image.value,
        chain.value,
        sort_order.value,
        order_by.value,
        page_size.value,
        page_number.value
      );

      const stylesResults = ["color: black", "background: grey"].join(";");
      console.log("%c📻 NFT Port Search fetched : %s", stylesResults, results);
      if (results.error) {
        console.log("Error", results.error);
      }
      if (results.search_results && results.search_results.length > 0) {
        store.addSearchResults(...results.search_results);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

/* Clear our Search Results */
async function clearSearch() {
  console.log("Clear Search Clicked!");
  await store.clearSearchResults();
}

onMounted(async () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  await checkIfWalletIsConnected();

  if (topTokens.value.length === 0) {
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
  }

  if (latestTokens.value.length === 0) {
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
  }

  if (anneTokens.value.length === 0) {
    let anneTokens = await store.contractNftSearch(
      "0x19b86299c21505cdf59cE63740B240A9C822b5E4",
      "ethereum",
      "metadata",
      "true",
      10,
      1
    );
    if (anneTokens.nfts) {
      store.addAnneTokens(...anneTokens.nfts);
    }
  }

  /* Anne NFT Collection */
  // if (anneTokens.value.length === 0) {
  //   let anneTokens = await store.contractNftSearch(
  //     "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
  //     "ethereum",
  //     "metadata",
  //     true,
  //     50,
  //     1
  //   );
  //   console.log("anneTokens", anneTokens.nfts);
  //   if (anneTokens.nfts && anneTokens.total > 0) {
  //     store.addAnneTokens(...anneTokens.nfts);
  //   }
  // }
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
  margin: 3em auto 1em;
  padding-bottom: 10px;

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
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 0 auto;
      }
      @include breakpoint($break-md) {
        width: auto;
        height: auto;
        margin: 0 auto;
      }
      @include breakpoint($break-sm) {
        width: 100%;
        height: auto;
        margin: 0 auto;
      }
      @include breakpoint($break-xs) {
        width: 100%;
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

        @include breakpoint($break-sm) {
          width: 98%;
          margin: 0 1%;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 0;
        }
        @include breakpoint($break-xs) {
          width: 98%;
          margin: 0 1%;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
      select.search-chain::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      select.search-chain:focus {
        border: 0;
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
        @include breakpoint($break-md) {
          min-width: 250px;
        }
        @include breakpoint($break-sm) {
          width: 98%;
          margin: 0 1%;
        }
        @include breakpoint($break-xs) {
          width: 98%;
          margin: 0 1%;
        }
      }
      input.search-contract::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-contract:focus {
        border: 0;
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
        @include breakpoint($break-sm) {
          width: 98%;
          margin: 0 1%;
        }
        @include breakpoint($break-xs) {
          width: 98%;
          margin: 0 1%;
        }
      }
      input.search-name::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-name:focus {
        border: 0;
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
        @include breakpoint($break-sm) {
          width: 98%;
          margin: 0 1%;
          border-top-right-radius: 0;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        @include breakpoint($break-xs) {
          width: 98%;
          margin: 0 1%;
          border-top-right-radius: 0;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
      input.search-image::placeholder {
        color: $mint-blue;
        letter-spacing: 1px;
      }
      input.search-image:focus {
        border: 0;
        outline: none;
      }
      /* Desktopn & Tablet Versions */
      .show-button {
        color: $white;
        background-color: $mint-black;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        width: auto;
        padding: 10px;
        text-align: center;
        margin-right: 5px;
        cursor: pointer;
        display: inline-block;
        @include breakpoint($break-md) {
          display: inline-block;
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
        background-color: $mint-orange;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        width: auto;
        padding: 10px;
        text-align: center;
        margin-right: 5px;
        cursor: pointer;
        display: inline-block;
        @include breakpoint($break-md) {
          display: inline-block;
        }
        @include breakpoint($break-sm) {
          display: none;
        }
        @include breakpoint($break-xs) {
          display: none;
        }
      }
      /* END Desktopn & Tablet Versions */
      /* Mobile Versions */
      .show-button-mobile {
        color: $white;
        background-color: $mint-black;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        width: 48%;
        padding: 1%;
        margin: 2% 1%;
        text-align: center;
        margin: 1%;
        cursor: pointer;
        display: none;
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: inline-block;
        }
        @include breakpoint($break-xs) {
          display: inline-block;
        }
      }
      .hide-button-mobile {
        color: $white;
        background-color: $mint-orange;
        border: 0;
        border-radius: 30px;
        letter-spacing: 1px;
        font-size: 14px;
        width: 48%;
        padding: 1%;
        margin: 2% 1%;
        text-align: center;
        margin-right: 5px;
        cursor: pointer;
        display: none;
        @include breakpoint($break-md) {
          display: none;
        }
        @include breakpoint($break-sm) {
          display: inline-block;
        }
        @include breakpoint($break-xs) {
          display: inline-block;
        }
      }
      /* END Mobile Versions */
      .search-clear-button {
        color: $white;
        background-color: $mint-blue;
        border: 1px solid $mint-blue;
        border-radius: 100px;
        font-size: 14px;
        padding: 8px 8px 6px 8px;
        text-align: center;
        margin: 10px 5px 0 5px;
        box-sizing: border-box;
        transition: 0.4s;
        cursor: pointer;

        &:hover {
          color: $mint-black;
          border: 1px solid $mint-black;
        }

        @include breakpoint($break-sm) {
          width: 48%;
          padding: 1%;
        }
        @include breakpoint($break-xs) {
          width: 48%;
          padding: 1%;
        }
      }
    }
  }
}
section#search-results {
  color: $white;
  background: $mint-black;
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 500px;
  padding: 10px 0 10px;

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
    max-width: 1279px;
    display: inline-block;
    margin: 0 auto;

    h2 {
      font-size: 1.6rem;
      text-align: center;
      padding-bottom: 0;
      text-decoration: none;
      border-bottom: 1px solid;
      margin-block-start: 0;
      margin-block-end: 0.5em;
    }

    .token-list {
      width: 100%;
      max-width: 1279px;
      display: inline-block;
      margin: 0 auto;
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
    @include breakpoint($break-lg) {
      width: 80%;
      margin: 0 auto;
    }
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
      width: 97%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 80%;
      margin: 0 auto;
    }
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
