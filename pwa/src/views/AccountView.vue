<template>
  <main>
    <article>
      <section id="content">
        <!-- Connect Tab -->
        <div v-if="!account" class="form-container">
          <h1>Mint Tea</h1>
          <p>
            Mint and brew cross-chain NFTs using our custom bridge, send tokens
            and NFTs to all your favourite blockchains.
          </p>
          <p>Connect your wallet to view your account NFTs for all chains</p>

          <div class="button-container">
            <button v-if="account" class="balance-button">
              {{ balance ? balance : 0 }}
            </button>
            <button
              v-if="!account"
              @click="connectWallet"
              class="connect-button"
            >
              Connect
            </button>
            <button class="explore-button">
              <router-link :to="{ name: 'explore' }">Explore</router-link>
            </button>
          </div>
        </div>
        <!-- Bridge Tab -->
        <div v-if="account && formTab === 'account'" class="form-container">
          <h1>Account NFTs</h1>
          <div class="input-row">
            <p>
              Browse all your NFTs across all the best blockchains like
              Ethereum, Polygon, Optimism and more coming soon...
            </p>
          </div>
          <div class="button-container">
            <button class="home-button">
              <router-link :to="{ name: 'home' }">Home</router-link>
            </button>
          </div>
          <button class="explore-button">
            <router-link :to="{ name: 'explore' }">Explore</router-link>
          </button>
        </div>
      </section>
    </article>
    <aside>
      <section id="explore">
        <div class="row">
          <div class="row-header">
            <h2>Ethereum<ArrowDownBlack class="arrow-down" /></h2>
          </div>
          <div v-if="ethereumTokens.length > 0" class="row token-list">
            <template v-for="token in ethereumTokens" :key="token.tokenId">
              <NftCard v-if="token.metadata" :token="token" />
            </template>
          </div>
        </div>
        <div class="row">
          <div class="row-header">
            <h2>Polygon<ArrowDownBlack class="arrow-down" /></h2>
          </div>
          <div v-if="polygonTokens.length > 0" class="row token-list">
            <template v-for="token in polygonTokens" :key="token.tokenId">
              <NftCard v-if="token.metadata" :token="token" />
            </template>
          </div>
        </div>
        <div class="row">
          <div class="row-header">
            <h2>Optimism<ArrowDownBlack class="arrow-down" /></h2>
          </div>
          <div v-if="optimismTokens.length > 0" class="row token-list">
            <template v-for="token in optimismTokens" :key="token.tokenId">
              <NftCard v-if="token.metadata" :token="token" />
            </template>
          </div>
        </div>
        <div class="row">
          <div class="row-header">
            <h2>Arbitrum<ArrowDownBlack class="arrow-down" /></h2>
          </div>
          <div v-if="arbitrumTokens.length > 0" class="row token-list">
            <template v-for="token in arbitrumTokens" :key="token.tokenId">
              <NftCard v-if="token.metadata" :token="token" />
            </template>
          </div>
        </div>
        <!-- <h2 v-if="ethereumTokens.length > 0">Ethereum NFTs</h2>
        <div v-if="ethereumTokens.length > 0" class="row token-list">
          <template v-for="token in ethereumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div> -->
        <!-- Polygon -->
        <!-- <h2 v-if="polygonTokens.length > 0">Polygon NFTs</h2>
        <div v-if="polygonTokens.length > 0" class="row token-list">
          <template v-for="token in polygonTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div> -->
        <!-- Optimism -->
        <!-- <h2 v-if="optimismTokens.length > 0">Optimism NFTs</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <template v-for="token in optimismTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div> -->
        <!-- Arbitrum -->
        <!-- <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFTs</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <template v-for="token in arbitrumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div> -->
      </section>
    </aside>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import our IPFS and NftStorage Services */
import authNFT from "../services/authNFT.js";

/* Import SVG */
import ArrowDownBlack from "../assets/svgs/ArrowDownBlack.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";

// Init Store
const store = useStore();

// Store Values and Methods
const {
  account,
  balance,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
} = storeToRefs(store);

// Set Form Tab
const formTab = ref("account");

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
      await fetchTokens();
      store.setLoading(false);
    }
  } catch (error) {
    console.log("Error", error);
    store.setLoading(false);
  }
}

/* Fetch NFT by Account Address */
async function fetchTokens() {
  if (account.value) {
    try {
      const authAccount = new authNFT();
      /* Ethereum */
      if (ethereumTokens.value.length === 0) {
        let ethereumTokens = await authAccount.fetchAccountNfts(
          1,
          account.value
        );
        store.addEthereumTokens(...ethereumTokens);
        let ethereumTestnetTokens = await authAccount.fetchAccountNfts(
          5,
          account.value
        );
        store.addEthereumTokens(...ethereumTestnetTokens);
      }
      if (polygonTokens.value.length === 0) {
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
      }
      /* Optimism */
      // if (optimismTokens.value.length === 0) {
      //   let optimismTokens = await authAccount.fetchAccountNfts(
      //     10,
      //     account.value
      //   );
      //   store.addOptimismTokens(...optimismTokens);
      //   let optimismTestnetTokens = await authAccount.fetchAccountNfts(
      //     69,
      //     account.value
      //   );
      //   store.addOptimismTokens(...optimismTestnetTokens);
      // }
      /* Arbitrum */
      // if (optimismTokens.value.length === 0) {
      //   let arbitrumTokens = await authAccount.fetchAccountNfts(
      //     42161,
      //     account.value
      //   );
      //   store.addArbitrumTokens(...arbitrumTokens);
      //   let arbitrumTestnetTokens = await authAccount.fetchAccountNfts(
      //     42161,
      //     account.value
      //   );
      //   store.addArbitrumTokens(...arbitrumTestnetTokens);
      // }
    } catch (error) {
      console.log(`Error fetching tokens, please refresh to try again!`);
    }
  }
}

onMounted(async () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  getAccount();
  await checkIfWalletIsConnected();
  await fetchTokens();
});
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

article {
  width: 43%;
  flex-grow: 1 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3em 5em;
  @include breakpoint($break-xl) {
    padding: 1em;
  }
  @include breakpoint($break-lg) {
    padding: 1em;
  }
  @include breakpoint($break-md) {
    padding: 1em 2em;
  }
  @include breakpoint($break-sm) {
    width: 100%;
    padding: 0 0 2em 0;
  }
  @include breakpoint($break-xs) {
    width: 100%;
    padding: 0 0 2em 0;
  }
}
aside {
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  background: $mint-pink;
  @include breakpoint($break-xl) {
    padding: 0 auto;
  }
  @include breakpoint($break-lg) {
    padding: 0 auto;
  }
  @include breakpoint($break-md) {
    border-top-left-radius: 30px;
    padding: 2em 0 0 0;
    overflow: hidden;
  }
  @include breakpoint($break-sm) {
    width: 100%;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 2em 1em;
  }
  @include breakpoint($break-xs) {
    width: 100%;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 1.5em 1em;
  }
}

section#content {
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: #fff;
    border: 4px solid var(--gradient-100);
    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    margin: 30px auto;
    padding: 30px 30px 20px;

    @include breakpoint($break-md) {
      width: 400px;
      margin: 0 auto 10px;
      padding: 25px 25px 20px;
    }
    @include breakpoint($break-sm) {
      width: 380px;
      margin: 0 auto 10px;
      padding: 20px 20px 20px;
    }
    @include breakpoint($break-xs) {
      width: 360px;
      margin: 0 auto 10px;
      padding: 20px 20px 20px;
    }

    img,
    svg {
      margin-top: -20px;
      width: 180px;
      object-fit: contain;
      overflow: hidden;
    }
    .header-logo {
      margin: 0 auto 20px;
    }

    h1 {
      font-family: "SFDisplay", Roboto, Ubuntu, "Open Sans", "Helvetica Neue",
        sans-serif;
      color: $mint-black;
      font-size: 2rem;
      line-height: 2rem;
      text-align: center;
      margin: 0 auto 15px;
      span.emoji {
        font-size: 2.2rem;
      }
    }

    a {
      color: $mint-black;
      font-weight: bold;
      border-bottom: 1px solid $mint-black;
      text-decoration: none;
    }

    p {
      line-height: 1.6;
      margin-bottom: 10px;
      text-align: center;
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .connect-button {
    color: $white;
    background-color: $mint-blue;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin: 10px 0;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
      color: $black;
    }
  }

  .explore-button {
    color: $white;
    background-color: $mint-orange;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    a {
      color: $white;
      text-decoration: none;
      border-bottom: none;
      &:hover {
        color: $black;
      }
    }
  }

  .home-button {
    color: $white;
    background-color: $mint-blue;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin: 10px 0;
    transition: 0.4s;
    cursor: pointer;
    a {
      color: $white;
      font-weight: bold;
      text-decoration: none;
      border-bottom: none;
      &:hover {
        color: $black;
      }
    }
  }
}

section#explore {
  width: 100%;
  color: $mint-black;
  background: $mint-pink;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding: 0 0 3em 3em;
  overflow: scroll;

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
      color: $mint-black;
      font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 36px;
      line-height: 42px;
      text-align: left;
      margin: 0 0 20px 20px;
      .arrow-down {
        margin-bottom: -5px;
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
}

@media (min-width: 1024px) {
  .explore {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
