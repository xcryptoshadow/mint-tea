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
            <button class="marketplace-button">
              <router-link :to="{ name: 'marketplace' }"
                >Marketplace</router-link
              >
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
          <button class="marketplace-button">
            <router-link :to="{ name: 'marketplace' }">Marketplace</router-link>
          </button>
        </div>

        <!-- Music NFT by Kerem -->
        <div v-if="keremTokens && keremTokens.length > 0">
          <template v-for="token in keremTokens" :key="token.contract">
            <MusicCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </section>
    </article>
    <aside>
      <section id="marketplace">
        <h2 v-if="ethereumTokens.length > 0">Ethereum NFTs</h2>
        <div v-if="ethereumTokens.length > 0" class="row token-list">
          <template v-for="token in ethereumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Polygon -->
        <h2 v-if="polygonTokens.length > 0">Polygon NFTs</h2>
        <div v-if="polygonTokens.length > 0" class="row token-list">
          <template v-for="token in polygonTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Optimism -->
        <h2 v-if="optimismTokens.length > 0">Optimism NFTs</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <template v-for="token in optimismTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
        <!-- Arbitrum -->
        <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFTs</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <template v-for="token in arbitrumTokens" :key="token.tokenId">
            <NftCard v-if="token.metadata" :token="token" />
          </template>
        </div>
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

/* Components */
import NftCard from "@/components/NftCard.vue";
import MusicCard from "@/components/MusicCard.vue";

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

section#content {
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: #fff;
    border: 4px solid var(--gradient-100);
    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    margin-bottom: 20px;
    padding: 25px;

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

    p {
      line-height: 1.7;
      margin-bottom: 10px;
      text-align: center;
    }

    .mb-10 {
      margin-bottom: 10px;
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .tab-button {
    color: $white;
    background-color: $mint-orange;
    font-size: 18px;
    font-weight: bold;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin-right: 10px;
    padding-left: 15px;
    padding-right: 15px;
    transition: 0.4s;
    cursor: pointer;
  }

  .mint-button {
    color: $white;
    background-color: $mint-black;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    transition: 0.4s;
    cursor: pointer;
  }

  .mint-button:disabled {
    background: #c6c6c6;
    color: #101010;
    cursor: not-allowed;
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

  .marketplace-button {
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
    background-color: $mint-green;
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
      text-decoration: none !important;
    }
    a:hover {
      color: $black;
    }
  }

  .music-nft-container {
    width: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: $mint-orange;
    border: 4px solid var(--gradient-100);
    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    padding: 0;

    h1 {
      font-family: "SFDisplay", Roboto, Ubuntu, "Open Sans", "Helvetica Neue",
        sans-serif;
      color: $mint-black;
      font-size: 1.7rem;
      line-height: 1.8rem;
      text-align: left;
      margin: 0 auto 15px;
    }

    a {
      color: $mint-black;
      font-weight: bold;
      border-bottom: 1px solid $mint-black;
      text-decoration: none;
    }

    p {
      line-height: 1.7;
      margin-bottom: 10px;
      text-align: center;
    }
  }
}

section#marketplace {
  height: inherit;
  color: $mint-black;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 1.5em 0 4em 3em;
  overflow: scroll;

  .row {
    display: flex;
    flex-direction: row;
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
    width: 100%;
    font-size: 1.7rem;
    font-weight: 400;
    text-align: left;
    color: $mint-black;
    text-decoration: underline;
    text-underline-offset: 10px;
    padding: 0 0 20px 40px;
    margin-block-start: 0;
    margin-block-end: 0;
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
    transition: 0.4s;
    cursor: pointer;
  }

  .mint-button:disabled {
    background: #c6c6c6;
    color: $mint-orange;
    cursor: not-allowed;
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
