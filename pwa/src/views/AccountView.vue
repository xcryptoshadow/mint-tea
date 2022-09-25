<template>
  <main>
    <section id="mint">
      <article>
        <!-- Left Side -->
        <section id="content">
          <!-- Connect Tab -->
          <div v-if="!account" class="form-container">
            <div class="header-logo">
              <BlueLogo />
            </div>
            <p>
              Mint and brew cross-chain NFTs using our custom bridge, send
              tokens and NFTs to all your favourite blockchains.
            </p>
            <p>
              Mint and brew cross-chain NFTs using our custom bridge, send
              tokens and NFTs to all your favourite blockchains.
            </p>
            <p>
              Search and verify your NFTs for rarity by name, description and
              image across all blockchains.
            </p>

            <div class="button-container">
              <button
                v-if="!account"
                @click="connectWallet"
                class="connect-button"
              >
                connect
              </button>
              <button class="explore-button">
                <router-link :to="{ name: 'explore' }">explore</router-link>
              </button>
            </div>
          </div>

          <!-- Account Tab -->
          <div v-if="account && formTab === 'account'" class="form-container">
            <div class="header-logo">
              <BlueLogo />
            </div>
            <h1>Account NFTs</h1>
            <div class="input-row">
              <p>
                View all your account NFTs from all the top blockchains
                including Ethereum, Polygon, Optimism, Arbitrum and Avalanche
                with more coming soon...
              </p>
            </div>
            <div class="button-container">
              <button class="home-button">
                <router-link :to="{ name: 'home' }">home</router-link>
              </button>
              <button class="explore-button">
                <router-link :to="{ name: 'explore' }">explore</router-link>
              </button>
            </div>
          </div>
        </section>
      </article>
      <aside>
        <section id="explore">
          <div class="row">
            <div class="row-header">
              <h2>ethereum<ArrowDownBlue class="arrow-down" /></h2>
            </div>
            <div v-if="ethereumTokens.length > 0" class="row token-list">
              <template v-for="token in ethereumTokens" :key="token.tokenId">
                <NftCard :token="token" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="row-header">
              <h2>polygon <ArrowDownBlue class="arrow-down" /></h2>
            </div>
            <div v-if="polygonTokens.length > 0" class="row token-list">
              <template v-for="token in polygonTokens" :key="token.tokenId">
                <NftCard :token="token" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="row-header">
              <h2>optimism <ArrowDownBlue class="arrow-down" /></h2>
            </div>
            <div v-if="optimismTokens.length > 0" class="row token-list">
              <template v-for="token in optimismTokens" :key="token.tokenId">
                <NftCard :token="token" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="row-header">
              <h2>arbitrum <ArrowDownBlue class="arrow-down" /></h2>
            </div>
            <div v-if="arbitrumTokens.length > 0" class="row token-list">
              <template v-for="token in arbitrumTokens" :key="token.tokenId">
                <ArbitrumNftCard :token="token" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="row-header">
              <h2>avalanche <ArrowDownBlue class="arrow-down" /></h2>
            </div>
            <div v-if="avalancheTokens.length > 0" class="row token-list">
              <template v-for="token in avalancheTokens" :key="token.tokenId">
                <NftCard :token="token" />
              </template>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import our Services and APIs */
import authNFT from "../services/authNFT.js";
import alchemyApi from "../services/alchemyApi.js";

/* Import SVG */
import BlueLogo from "../assets/svgs/BlueLogo.vue?component";
import ArrowDownBlue from "../assets/svgs/ArrowDownBlue.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";
import ArbitrumNftCard from "@/components/ArbitrumNftCard.vue";

/* Init Pinia Store Values and Methods */
const store = useStore();
const {
  account,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
  avalancheTokens,
} = storeToRefs(store);

/* Set Form Tab */
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
      }

      /* Polygon */
      if (polygonTokens.value.length === 0) {
        let polygonTokens = await authAccount.fetchAccountNfts(
          137,
          account.value
        );
        store.addPolygonTokens(...polygonTokens);
      }

      /* We use Alchemy API for Optimisim and Arbitrum */
      const authAlchemyAccount = new alchemyApi();

      /* Optimism */
      if (optimismTokens.value.length === 0) {
        let optimismTokens = await authAlchemyAccount.fetchAccountNfts(
          10,
          account.value
        );
        store.addOptimismTokens(...optimismTokens);
      }

      /* Arbitrum */
      if (arbitrumTokens.value.length === 0) {
        let arbitrumTokens = await authAlchemyAccount.fetchAccountNfts(
          42161,
          account.value
        );
        store.addArbitrumTokens(...arbitrumTokens);
      }

      /* Avalanche */
      // if (avalancheTokens.value.length === 0) {
      //   let avalancheTokens = await authAccount.fetchAccountNfts(
      //     42161,
      //     account.value
      //   );
      //   store.addAvalancheTokens(...avalancheTokens);
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

section#mint {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
  background: linear-gradient(
    269.69deg,
    #fbe2ff 0.3%,
    rgba(251, 226, 255, 0) 99.77%
  );
  @include breakpoint($break-sm) {
    flex-flow: column wrap;
  }
  @include breakpoint($break-xs) {
    flex-flow: column wrap;
  }
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
      padding: 1em 0.5em;
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
    margin: 0;
    padding: 0 auto;
    @include breakpoint($break-xl) {
      padding: 0 auto;
    }
    @include breakpoint($break-lg) {
      padding: 0 auto;
    }
    @include breakpoint($break-md) {
      padding: 2em 0 0 0;
      overflow: hidden;
    }
    @include breakpoint($break-sm) {
      width: 100%;
      padding: 2em 1em;
    }
    @include breakpoint($break-xs) {
      width: 100%;
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
      width: 428px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      background: #fff;
      border: 4px solid var(--gradient-100);
      box-shadow: 2px 2px 25px 6px rgba(43, 43, 43, 0.1);
      border-radius: 10px;
      margin: 30px auto;
      padding: 30px 40px;

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

      .header-logo {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;

        img,
        svg {
          width: 260px;
          margin: 10px auto 20px;
          object-fit: contain;
          overflow: hidden;
          @include breakpoint($break-md) {
            width: 200px;
            margin: 30px auto 10px;
          }
          @include breakpoint($break-sm) {
            width: 180px;
            margin: 30px auto 10px;
          }
        }
      }

      h1 {
        color: $mint-black;
        font-size: 2rem;
        line-height: 2rem;
        text-align: center;
        margin: 20px auto 15px;
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
        margin-bottom: 10px;
        text-align: center;
      }
      .mb-10 {
        margin-bottom: 10px;
      }
    }

    .button-container {
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    .connect-button {
      color: $white;
      background-color: $mint-black;
      font-size: 18px;
      font-weight: bold;
      width: 48%;
      height: 55px;
      border: 0;
      border-radius: 30px;
      margin: 10px 1% 10px 0;
      transition: 0.4s;
      cursor: pointer;
      &:hover {
        color: $mint-blue;
      }
    }

    .explore-button {
      color: $white;
      background-color: $mint-blue;
      font-size: 18px;
      font-weight: bold;
      width: 48%;
      height: 55px;
      border: 0;
      border-radius: 30px;
      margin: 10px 0 10px 1%;
      transition: 0.4s;
      cursor: pointer;
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
      background-color: $mint-black;
      font-size: 18px;
      font-weight: bold;
      width: 48%;
      height: 55px;
      border: 0;
      border-radius: 30px;
      margin: 10px 1% 10px 0;
      transition: 0.4s;
      cursor: pointer;
      a {
        color: $white;
        text-decoration: none;
        border-bottom: none;
        &:hover {
          color: $mint-blue;
        }
      }
    }
  }

  section#explore {
    width: 100%;
    color: $mint-black;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    padding: 0 0 3em 3em;
    overflow: scroll;

    @include breakpoint($break-lg) {
      padding: 0 0 3em 3em;
    }
    @include breakpoint($break-md) {
      padding: 0 0 3em 0;
    }
    @include breakpoint($break-sm) {
      padding: 0 0 3em 0;
    }
    @include breakpoint($break-xs) {
      padding: 0 0 3em 0;
    }

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
        width: 100%;
        margin: 0 auto;
      }
      @include breakpoint($break-md) {
        width: 100%;
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
        font-style: normal;
        font-weight: 700;
        font-size: 36px;
        line-height: 42px;
        text-align: left;
        margin: 0 0 20px 20px;
        .arrow-down {
          margin: 10px 0 -10px 10px;
        }
      }
    }

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
      max-width: 1280px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 0 auto;
        grid-template-columns: repeat(2, 1fr);
      }
      @include breakpoint($break-md) {
        width: 100%;
        margin: 0 auto;
        grid-template-columns: repeat(1, 1fr);
      }
      @include breakpoint($break-sm) {
        width: 100%;
        margin: 0 auto;
        grid-template-columns: repeat(2, 1fr);
      }
      @include breakpoint($break-xs) {
        width: 100%;
        margin: 0 auto;
        grid-template-columns: repeat(1, 1fr);
      }
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
