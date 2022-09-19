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
              Brew up some fresh cross-chain NFTs and port your favourite NFTs
              to all the top chains and maximise your exposure.
            </p>
            <p>
              Mint Tableland NFTs with mutable metadata all stored in relational
              data tables on chain.
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

          <!-- Bridge Tab -->
          <div v-if="account && formTab === 'bridge'" class="form-container">
            <h1>Bridge NFT</h1>
            <div class="input-row">
              <p>
                Bridge your favourite NFTs to all the top chains to maximise
                your exposure using our NFT bridge.
              </p>
              <p>
                Your NFT will be minted as a wrapped mNFT on the target chain
                and locked on the chain of origin.
              </p>
            </div>
            <div class="select-row">
              <label class="black">Bridge From</label>
              <select
                class="bridge-from-chain"
                v-model="bridgeFrom"
                @change="updateBridgeFrom($event)"
              >
                <option
                  v-for="option in options"
                  :value="option.label"
                  :key="option.key"
                >
                  {{ option.text }}
                </option>
              </select>
              <span class="bridge-step-one">
                Select where you would like to bridge your tokens from in the
                below dropdown
              </span>
            </div>
            <div class="select-row">
              <label class="black">Bridge To</label>
              <select class="bridge-to-chain" v-model="bridgeTo">
                <option
                  v-for="option in options"
                  :value="option.label"
                  :key="option.key"
                >
                  {{ option.text }}
                </option>
              </select>
              <span class="bridge-step-one">
                Click on your token from the list and then approve the token to
                lock it for bridge transfer. Make sure to keep your browser
                window open to complete the process.
              </span>
            </div>
            <div class="button-container">
              <button
                class="bridge-button-left"
                @click="bridgeNFT()"
                :disabled="!approvedBridge"
              >
                bridge
              </button>
              <button class="back-button" @click="switchTab('mint')">
                back
              </button>
            </div>
          </div>
          <!-- END Bridge Tab -->

          <!-- Mint Tab -->
          <div v-if="account && formTab === 'mint'" class="form-container">
            <h1>Mint NFT</h1>
            <div class="input-row-first">
              <label for="file">Upload file</label>
              <input
                type="file"
                name="file"
                ref="fileRef"
                placeholder="PNG, JPG, GIF, SVG or MP4"
                @change="uploadFileHandler()"
              />
              <span class="loading">{{ loading ? "loading..." : "" }}</span>
            </div>
            <div class="input-row">
              <label for="name">Name</label>
              <input type="text" name="name" v-model="name" />
            </div>
            <div class="input-row">
              <label for="description">Description</label>
              <textarea type="text" name="description" v-model="description" />
            </div>
            <div class="input-row mb-10">
              <label for="externalUrl">External URL</label>
              <input type="text" name="externalUrl" v-model="externalUrl" />
            </div>
            <div class="input-row mb-10 hidden">
              <label for="animationUrl">Animation URL</label>
              <input type="text" name="animationUrl" v-model="animationUrl" />
            </div>
            <div class="input-row mb-10 hidden">
              <label for="youtubeUrl">Youtube URL</label>
              <input type="text" name="youtubeUrl" v-model="youtubeUrl" />
            </div>
            <div class="input-row-end">
              <span class="file-size">File Size {{ size ? size : 0 }}</span>
            </div>
            <div class="button-container">
              <button
                v-if="!tokenId"
                :disabled="!account"
                class="mint-button"
                @click="mintNFT()"
              >
                mint
              </button>
              <button class="bridge-button-right" @click="switchTab('bridge')">
                bridge
              </button>
            </div>
          </div>
          <!-- END Mint Tab -->
        </section>
        <!-- END Left Side -->
      </article>
      <aside>
        <!-- Right Side -->
        <section id="nft-modal" class="bubbles-brewing">
          <!-- Show loading if we uploading a file -->
          <div v-if="loading && formTab === 'mint'" class="nft-modal-loading">
            <div class="loading">loading ...</div>
          </div>

          <!-- Once file loaded, we can enter Name and Description -->
          <div
            v-if="imageUrl && !showBridgeTokens && formTab === 'mint'"
            class="nft-modal-card"
          >
            <div v-if="getUrlProtocol(imageUrl) === 'mp4'" class="nft-video">
              <video width="320" height="240" controls>
                <source :src="getUrlProtocol(imageUrl)" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-if="getUrlProtocol(imageUrl) === 'mp3'" class="nft-video">
              <audio ref="player" width="320" height="240">
                <source :src="imageUrl" type="audio/mpeg" />
              </audio>
              <video width="320" height="240" controls>
                <source :src="getUrlProtocol(imageUrl)" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else-if="imageUrl" class="nft-modal-image">
              <img
                v-if="imageUrl"
                :src="`${getUrlProtocol(imageUrl)}`"
                :alt="`${name}`"
              />
            </div>
            <div class="nft-modal-title">
              {{ name }}
            </div>
            <div class="nft-modal-description">
              {{ description }}
            </div>
            <div class="nft-modal-external-url">
              {{ externalUrl }}
            </div>
            <!-- <div class="nft-modal-description">
              {{ animationUrl }}
            </div> -->
            <!-- <div class="nft-modal-description">
              {{ youtubeUrl }}
            </div> -->
            <div class="nft-modal-attributes">
              <template v-for="(index, attr) in attributes" :key="index">
                <div class="nft-attribute">
                  <div class="nft-attribute-icon">{{ attr.icon }}</div>
                  <div class="nft-attribute-display-type">
                    {{ attr.display_type }}
                  </div>
                  <div class="nft-attribute-trait-type">
                    {{ attr.trait_type }}
                  </div>
                  <div class="nft-attribute-value">{{ attr.value }}</div>
                </div>
              </template>
            </div>
            <div class="nft-modal-image-url">
              <div class="file-copy-url">
                <a
                  title="Copy to clipboard"
                  target="_blank"
                  @click="copyFileLink(imageUrl)"
                >
                  Copy link
                </a>
              </div>
              <div class="file-image-url">
                <a :href="imageUrl" title="Open in new tab" target="_blank">
                  Open link
                </a>
              </div>
            </div>
          </div>
          <!-- Pull Tokens by Account to Bridge -->
          <div
            v-if="!imageUrlBridge && showBridgeTokens && formTab === 'bridge'"
            class="nft-bridge-tokens"
          >
            <div
              v-if="bridgeFrom === 'ethereum' || bridgeFrom === 'all'"
              class="row"
            >
              <div class="row-header">
                <h2>Ethereum <ArrowDownBlue class="arrow-down" /></h2>
              </div>
              <div v-if="ethereumTokens.length > 0" class="row token-list">
                <template v-for="token in ethereumTokens" :key="token.tokenId">
                  <NftCard
                    v-if="token.metadata"
                    :token="token"
                    @click="loadNFTDetails(token)"
                  />
                </template>
              </div>
            </div>
            <div
              v-if="bridgeFrom === 'polygon' || bridgeFrom === 'all'"
              class="row"
            >
              <div class="row-header">
                <h2>Polygon <ArrowDownBlue class="arrow-down" /></h2>
              </div>
              <div v-if="polygonTokens.length > 0" class="row token-list">
                <template v-for="token in polygonTokens" :key="token.tokenId">
                  <NftCard
                    v-if="token.metadata"
                    :token="token"
                    @click="loadNFTDetails(token)"
                  />
                </template>
              </div>
            </div>
            <div
              v-if="bridgeFrom === 'optimism' || bridgeFrom === 'all'"
              class="row"
            >
              <div class="row-header">
                <h2>Optimism <ArrowDownBlue class="arrow-down" /></h2>
              </div>
              <div v-if="optimismTokens.length > 0" class="row token-list">
                <template v-for="token in optimismTokens" :key="token.tokenId">
                  <NftCard
                    v-if="token.metadata"
                    :token="token"
                    @click="loadNFTDetails(token)"
                  />
                </template>
              </div>
            </div>
            <div
              v-if="bridgeFrom === 'arbitrum' || bridgeFrom === 'all'"
              class="row"
            >
              <div class="row-header">
                <h2>Arbitrum <ArrowDownBlue class="arrow-down" /></h2>
              </div>
              <div v-if="arbitrumTokens.length > 0" class="row token-list">
                <template v-for="token in arbitrumTokens" :key="token.tokenId">
                  <NftCard
                    v-if="token.metadata"
                    :token="token"
                    @click="loadNFTDetails(token)"
                  />
                </template>
              </div>
            </div>
            <div
              v-if="bridgeFrom === 'avalanche' || bridgeFrom === 'all'"
              class="row"
            >
              <div class="row-header">
                <h2>Avalanche <ArrowDownBlue class="arrow-down" /></h2>
              </div>
              <div v-if="avalancheTokens.length > 0" class="row token-list">
                <template v-for="token in avalancheTokens" :key="token.tokenId">
                  <NftCard
                    v-if="token.metadata"
                    :token="token"
                    @click="loadNFTDetails(token)"
                  />
                </template>
              </div>
            </div>
          </div>
          <!-- END Pull Tokens by Account to Bridge -->
          <div
            v-if="tokenIdBridge && imageUrlBridge && formTab === 'bridge'"
            class="nft-bridge-modal-card"
          >
            <div
              v-if="getUrlProtocol(imageUrlBridge) === 'mp4'"
              class="nft-bridge-video"
            >
              <video width="320" height="240" controls>
                <source
                  :src="getUrlProtocol(imageUrlBridge)"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              v-if="getUrlProtocol(imageUrlBridge) === 'mp3'"
              class="nft-bridge-modal-video"
            >
              <audio ref="player" width="320" height="240">
                <source :src="imageUrlBridge" type="audio/mpeg" />
              </audio>
              <video width="320" height="240" controls>
                <source
                  :src="getUrlProtocol(imageUrlBridge)"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else-if="imageUrlBridge" class="nft-bridge-modal-image">
              <img
                v-if="imageUrlBridge"
                :src="`${getUrlProtocol(imageUrlBridge)}`"
                :alt="`${nameBridge}`"
              />
            </div>
            <div class="nft-bridge-modal-title">
              {{ nameBridge }}
            </div>
            <div class="nft-bridge-modal-tokenId">
              Token Id : {{ tokenIdBridge }}
            </div>
            <div class="nft-bridge-modal-contract-address">
              Contract Address : {{ contractAddressBridge }}
            </div>
            <div class="nft-bridge-modal-approve">
              <button
                :class="!approvedBridge ? 'approve-button' : 'approved-button'"
                @click="ConfirmApprovedBridge(true)"
              >
                {{ !approvedBridge ? "Approve" : "Locked" }}
              </button>
              <button class="cancel-button" @click="CancelBridge()">
                Cancel
              </button>
            </div>
          </div>
        </section>
      </aside>
      <!-- END Right Side -->
    </section>
    <!-- Collections -->
    <section id="collections">
      <div class="row-header">
        <h2>
          <span class="mint-black">minty</span>fresh
          <ArrowDownWhite class="arrow-down" />
        </h2>
      </div>
      <div class="row token-list">
        <template v-for="token in trendingTokens" :key="token.token_id">
          <NftCard
            v-if="token.metadata && token.metadata.image"
            :token="token"
          />
        </template>
      </div>
      <div class="row token-list">
        <template v-for="token in latestTokens" :key="token.token_id">
          <NftCard
            v-if="token.metadata && token.metadata.image"
            :token="token"
          />
        </template>
      </div>
      <div class="row token-list">
        <template v-for="token in topTokens" :key="token.token_id">
          <NftCard
            v-if="token.metadata && token.metadata.image"
            :token="token"
          />
        </template>
      </div>
    </section>
    <CollectionSection />
    <AboutSection />
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
/* Import Libraries */
import { ethers } from "ethers";
// import { BigNumber } from "bignumber.js";
import moment from "moment";

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import our IPFS and NftStorage Services */
import { uploadBlob } from "../services/ipfs.js";
import { fileSize, copyToClipboard, generateLink } from "../services/helpers";
import { nftStorage } from "../services/nftStorage.js";
import authNFT from "../services/authNFT.js";

/* Import SVGs */
import ArrowDownWhite from "../assets/svgs/ArrowDownWhite.vue?component";
import ArrowDownBlue from "../assets/svgs/ArrowDownBlue.vue?component";
import BlueLogo from "../assets/svgs/BlueLogo.vue?component";
// import BubblesOne from "../assets/svgs/BubblesOne.vue?component";
// import BubblesTwo from "../assets/svgs/BubblesTwo.vue?component";
// import BubblesThree from "../assets/svgs/BubblesThree.vue?component";
// import BubblesFour from "../assets/svgs/BubblesFour.vue?component";
// import BubblesFive from "../assets/svgs/BubblesFive.vue?component";
// import BrewingBubbles from "../assets/svgs/BrewingBubbles.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";
import CollectionSection from "@/components/CollectionSection.vue";
import AboutSection from "@/components/AboutSection.vue";

/* Import Smart Contract ABI */
import contractAbi from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
import bridgeContractAbiEthereum from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
import bridgeContractAbiPolygon from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
import bridgeContractAbiOptimism from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
import bridgeContractAbiArbitrum from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
import bridgeContractAbiAvalanche from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
/* Mint Tea Contract Address */
const contractAddress = "0xbE3601f014e0A861bc837bD1f24822cE23592422";
const bridgeContractAddressEthereum = "";
const bridgeContractAddressOptimism = "";
const bridgeContractAddressPolygon =
  "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
const bridgeContractAddressAvalanche =
  "0xb2C3a5d2296b4d6BCb272E60f4Ce10d17Afcf32a";
const bridgeContractAddressArbitrum =
  "0x195a17f9e714a79A9D4E1757Fe59a01a7B59Ea23";

/* Console log with some style */
const stylesContract = ["color: black", "background: #e9429b"].join(";");
console.log(
  "%c🍵 Mint Tea Contract Address %s",
  stylesContract,
  contractAddress
);
const stylesAbi = ["color: black", "background: cyan"].join(";");
console.log("%c🧭 Contract ABI Source %s", stylesAbi, contractAbi.sourceName);

/* Init Pinia Store Values and Methods */
const store = useStore();
const {
  loading,
  account,
  topTokens,
  latestTokens,
  trendingTokens,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
  avalancheTokens,
} = storeToRefs(store);

/* Set Form Tab */
const formTab = ref("mint");
const showBridgeTokens = ref(false);

/* File Uploader Ref */
const fileRef = ref(null);

/* NFT Form Metadata fields */
const tokenId = ref("");
const cid = ref("");
/* Visible on form, above hidden on form */
const name = ref("");
const description = ref("");
const imageUrl = ref(null);
const externalUrl = ref("");
const animationUrl = ref("");
const youtubeUrl = ref("");
const attributes = ref([]);
/* Calculated on Mint and IPFS upload */
const size = ref("");
const createdAt = ref("");
const audioVideoType = ref("");

/* Bridge Fields and Data */
const bridgeFrom = ref("all");
const bridgeTo = ref("all");
const options = ref([
  { value: 1, label: "ethereum", text: "Ethereum Mainnet" },
  // { value: 5, label: "ethereum-testnet", text: "Ethereum Testnet" },
  { value: 137, label: "polygon", text: "Polygon Mainnet" },
  // { value: 80001, label: "polygon-testnet", text: "Mumbai Testnet" },
  { value: 10, label: "optimism", text: "Optimism Mainnet" },
  // { value: 69, label: "optimism-testnet", text: "Optimism Testnet" },
  { value: 42161, label: "arbitrum", text: "Arbitrum Mainnet" },
  // { value: 421611, label: "arbitrum-testnet", text: "Arbitrum Testnet" },
  { value: 0, label: "all", text: "All" },
]);
/* Bridge NFT Details */
const tokenIdBridge = ref("");
const contractAddressBridge = ref("");
const nameBridge = ref("");
const imageUrlBridge = ref(null);
const approvedBridge = ref(false);

/* Load our Bridge NFT to approve */
function loadNFTDetails(token) {
  console.log("Bridge Token Loaded:", token);
  if (token.tokenId || token.token_id) {
    tokenIdBridge.value = token.tokenId
      ? token.tokenId
      : token.token_id
      ? token.token_id
      : "";
    console.log("Token Id:", tokenIdBridge.value);
  }
  if (token.contract) {
    contractAddressBridge.value = token.contract;
    console.log("Contract Address Bridge:", contractAddressBridge.value);
  }
  console.log("Token Metdata:", token.metadata);
  if (token.metadata.name) {
    nameBridge.value = token.metadata.name;
    console.log("Token Name Bridge:", nameBridge.value);
  }
  if (token.metadata.image) {
    imageUrlBridge.value = token.metadata.image;
    console.log("Token Image Bridge:", imageUrlBridge.value);
  }
  /* Hide the Token Panel */
  showBridgeTokens.value = false;
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
      // if (arbitrumTokens.value.length === 0) {
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
      /* Avalanche */
      // if (avalancheTokens.value.length === 0) {
      //   let avalancheTokens = await authAccount.fetchAccountNfts(
      //     42161,
      //     account.value
      //   );
      //   store.addAvalancheTokens(...avalancheTokens);
      //   let avalancheTestnetTokens = await authAccount.fetchAccountNfts(
      //     42161,
      //     account.value
      //   );
      //   store.addAvalancheTokens(...avalancheTestnetTokens);
      // }
    } catch (error) {
      console.log(`Error fetching tokens, please refresh to try again!`);
    }
  }
}

/**
 * Switch Tab
 */
const switchTab = (value) => {
  formTab.value = value;
  if (value === "mint") showBridgeTokens.value = false;
  if (value === "bridge") showBridgeTokens.value = true;
};

/**
 * Copy to Clipboard function
 */
const copyFileLink = (url) => {
  copyToClipboard(url);
  // notyf.success("Link copied to clipboard!");
  console.log("Link copied to clipboard!");
};

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
      store.setLoading(false);
    }
  } catch (error) {
    console.log("Error", error);
    store.setLoading(false);
  }
}

function getUrlProtocol(url) {
  let protocol = url.endsWith("mp4") ? 5 : 0;
  if (protocol == 0) protocol = url.endsWith("mp3") ? 6 : 0;
  if (protocol == 0) protocol = url.endsWith("gif") ? 7 : 0;
  if (protocol == 0) protocol = url.startsWith("http://") ? 1 : 0;
  if (protocol == 0) protocol = url.startsWith("https://") ? 2 : 0;
  if (protocol == 0) protocol = url.startsWith("ipfs://") ? 3 : 0;
  if (protocol == 0) protocol = url !== "" ? 4 : 0;
  switch (protocol) {
    case 1:
      return url;
    case 2:
      return url;
    case 3:
      return "https://ipfs.io/ipfs/" + url.substring(7);
    case 4:
      return generateLink(url);
    case 5:
      return "mp4";
    case 6:
      return "mp3";
    case 7:
      return url;
    case 0:
      return "Not http or https";
  }
}

/**
 * @param {File} file
 * @returns {Object}
 */
const uploadFileHandler = async () => {
  /**
   * Upload file and store using NFT.Storage
   */
  const file = fileRef.value.files;
  console.log("File :", file[0]);

  store.setLoading(true);
  const uploadResult = await uploadBlob(file[0]);
  console.log("Upload Result :", uploadResult);

  const { error } = uploadResult;
  if (error && error instanceof Error) {
    console.log(error.message);
    store.setLoading(false);
    return uploadResult;
  }

  /* Set our NFT Metadata Form Values using IPFS best practises */
  cid.value = uploadResult.data.cid;
  /* Strip image type off our name eg, .png, .jpeg, .gif */
  // name.value = uploadResult.data.file.name.substring(
  //   0,
  //   uploadResult.data.file.name.lastIndexOf(".")
  // );
  /* Generate and IPFS URI for NFT's */
  imageUrl.value = generateLink(uploadResult.data);

  /* Set details from file upload */
  audioVideoType.value = uploadResult.data.file.type;
  size.value = fileSize(uploadResult.data.file.size);
  createdAt.value = uploadResult.data.file.created_at;
  store.setLoading(false);

  return uploadResult;
};

/**
 * Mint NFT
 */
const mintNFT = async () => {
  /**
   * Some very basic form validation
   */
  if (!name.value) {
    console.log(`Please enter a name to continue!`);
    return;
  }
  if (name.value.length < 3) {
    console.log(`Name must be longer then 3 characters!`);
    return;
  }
  if (!imageUrl.value) {
    console.log(`Please upload an image to continue!`);
    return;
  }
  if (imageUrl.value.length < 10) {
    console.log(`Please upload a valid image to continue!`);
    return;
  }
  if (!description.value) {
    console.log(`Please enter a description to continue!`);
    return;
  }
  if (description.value.length < 10) {
    console.log(`Description must be longer then 10 characters!`);
    return;
  }

  /**
   * Mint our NFT with metadata on NFT.Storage
   */
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi.abi,
        signer
      );

      const styles = ["color: black", "background: green"].join(";");
      console.log(
        "%c🍵 Mint Tea Smart Contract Address:  %s ",
        styles,
        contractAddress
      );

      /**
       *  Receive Emitted Event from Contract
       *  @dev See NewNftMinted emitted from our smart contract safeMint function
       */
      contract.on("NewNftMinted", (receiver, timestamp, newTokenId) => {
        console.log("Receiver :", receiver);

        createdAt.value = moment.unix(timestamp).toString();
        console.log("Created At :", createdAt.value);

        tokenId.value = newTokenId.toNumber();
        console.log("TokenId :", tokenId.value);
      });

      /* Store NFT Metadata on NFT.Storage */
      const nftStorageTMetadataURI = await nftStorage(
        name.value,
        description.value,
        imageUrl.value,
        externalUrl.value,
        animationUrl.value,
        youtubeUrl.value,
        attributes.value,
        audioVideoType.value
      );
      const stylesNFTStorage = ["color: black", "background: #f23f3f"].join(
        ";"
      );
      console.log(
        "%c💾 NFT.Storage ipfs:// link :  %s 💾",
        stylesNFTStorage,
        nftStorageTMetadataURI
      );
      /* Check our Transaction results */
      if (!nftStorageTMetadataURI) return;

      /* Mint our NFT using custom structure */
      // let nftTxn = await contract.safeMint(
      //   signer.getAddress(),
      //   nftStorageTMetadataURI
      // );

      const mintDate = new Date();
      const mintDateTimestamp = mintDate.getTime();
      const mintDateString = mintDateTimestamp.toString();
      // const mintDateBigNo = new BigNumber(mintDateTimestamp);
      console.log("mintDateString", mintDateString);

      let nftTxn = await contract.safeMint(
        signer.getAddress(),
        name.value,
        description.value,
        imageUrl.value,
        externalUrl.value,
        "https://cloudflare-ipfs.com/ipfs/bafkreibx3akdct6syqhkis3dqsnekukhh5ib5pdwepfki7hf45viv4ylp4",
        "date",
        "Brewed by 🍵 Mint Tea",
        mintDateString
      );

      const stylesMining = ["color: black", "background: yellow"].join(";");
      console.log("%c⛏ Mining...please wait!  %s ⛏", stylesMining, nftTxn.hash);

      // The OpenZeppelin base ERC721 contract emits a Transfer event
      // when a token is issued. tx.wait() will wait until a block containing
      // our transaction has been mined and confirmed. The transaction receipt
      // contains events emitted while processing the transaction.
      const receipt = await nftTxn.wait();

      const stylesReceipt = ["color: black", "background: #e9429b"].join(";");
      console.log(
        "%c💎 We just mined another gem! %s 💎",
        stylesReceipt,
        nftTxn.hash
      );

      /* Check our Transaction results */
      if (receipt.status === 1) {
        /**
         * @dev NOTE: Switch up these links once we go to Production
         * Currently set to use Polygon Mumbai Testnet
         */
        const stylesPolygon = ["color: white", "background: #7e44df"].join(";");
        console.log(
          `%c🧬 NFT Minted on Polygon, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash} %s`,
          stylesPolygon,
          nftTxn.hash
        );

        /* Remove loading indicator and show success notification */
        console.log(
          `🧬 NFT has been minted successfully, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`
        );
      }
      return;
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Bridge NFT
 */
const bridgeNFT = async () => {
  /**
   * Bridge our NFT with custom deBridge DeNFT contracts
   */
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      /* Get correct Contract Address and ABI for the chain */
      let contractAddress = null;
      let contractABI = null;

      if (bridgeFrom.value === "ethereum") {
        /* Ethereum */
        contractAddress = bridgeContractAddressEthereum;
        contractABI = bridgeContractAbiEthereum.abi;
      } else if (bridgeFrom.value === "optimism") {
        /* Optimism */
        contractAddress = bridgeContractAddressOptimism;
        contractABI = bridgeContractAbiOptimism.abi;
      } else if (bridgeFrom.value === "polygon") {
        /* Polygon */
        contractAddress = bridgeContractAddressPolygon;
        contractABI = bridgeContractAbiPolygon.abi;
      } else if (bridgeFrom.value === "arbitrum") {
        /* Arbitrum */
        contractAddress = bridgeContractAddressArbitrum;
        contractABI = bridgeContractAbiArbitrum.abi;
      } else if (bridgeFrom.value === "avalanche") {
        /* Avalanche */
        contractAddress = bridgeContractAddressAvalanche;
        contractABI = bridgeContractAbiAvalanche.abi;
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const styles = ["color: black", "background: green"].join(";");
      console.log(
        "%c🍵 Mint Tea Bridge Contract Address:  %s ",
        styles,
        contractAddress
      );

      let nftTxn = await contract.safeMint(
        signer.getAddress(),
        name.value,
        description.value,
        imageUrl.value,
        externalUrl.value
      );

      const stylesMining = ["color: black", "background: yellow"].join(";");
      console.log("%c⛏ Mining...please wait!  %s ⛏", stylesMining, nftTxn.hash);

      // The OpenZeppelin base ERC721 contract emits a Transfer event
      // when a token is issued. tx.wait() will wait until a block containing
      // our transaction has been mined and confirmed. The transaction receipt
      // contains events emitted while processing the transaction.
      const receipt = await nftTxn.wait();

      const stylesReceipt = ["color: black", "background: #e9429b"].join(";");
      console.log(
        "%c💎 We just mined another gem! %s 💎",
        stylesReceipt,
        nftTxn.hash
      );

      /* Check our Transaction results */
      if (receipt.status === 1) {
        /**
         * @dev NOTE: Switch up these links once we go to Production
         * Currently set to use Polygon Mumbai Testnet
         */
        const stylesPolygon = ["color: white", "background: #7e44df"].join(";");
        console.log(
          `%c🧬 NFT Minted on Polygon, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash} %s`,
          stylesPolygon,
          nftTxn.hash
        );

        /* Remove loading indicator and show success notification */
        console.log(
          `🧬 NFT has been minted successfully, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`
        );
      }
      return;
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Approve Bridge Transfer
 */
const updateBridgeFrom = (event) => {
  console.log("bridgeFrom.value:", event.target.value);
  console.log("Bridge From:", bridgeFrom.value);
  bridgeFrom.value = event.target.value;
  console.log("Bridge From:", bridgeFrom.value);
};

/**
 * Approve Bridge Transfer
 */
const ConfirmApprovedBridge = (value) => {
  approvedBridge.value = value;
};

/**
 * Cancel Bridge Transfer
 */
const CancelBridge = () => {
  tokenIdBridge.value = "";
  contractAddressBridge.value = "";
  nameBridge.value = "";
  imageUrlBridge.value = null;
  approvedBridge.value = false;
  showBridgeTokens.value = true;
};

onMounted(async () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  getAccount();
  await checkIfWalletIsConnected();
  await fetchTokens();

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
  align-items: center;
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
    padding: 2em 5em 3em;
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
}
section#content {
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 428px;
    height: 642px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    background: #fff;
    border: 4px solid var(--gradient-100);
    box-shadow: 2px 2px 25px 6px rgba(43, 43, 43, 0.1);
    border-radius: 10px;
    margin: 30px auto;
    padding: 30px 40px;
    z-index: 999;

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
        width: 200px;
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
      margin: 20px auto;
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
      margin-bottom: 20px;
      text-align: center;
    }

    .mb-10 {
      margin-bottom: 10px;
    }
  }

  .input-row-first {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    .loading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      width: 100%;
      height: 12px;
      color: $mint-black;
      font-size: 12px;
      line-height: 12px;
      font-weight: normal;
      text-align: right;
      padding-right: 25px;
      transition: 0.4s;
    }
  }

  .input-row {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 12px;
    width: 100%;
  }

  .input-row-end {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    .file-size {
      color: $mint-black;
      text-align: right;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 15px;
      margin: 15px 10px 5px 10px;
    }
  }

  .hidden {
    display: none;
  }

  label {
    color: $mint-blue;
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.1em;
    margin: 8px 0 2px 15px;
  }

  input[type="file"] {
    width: 100%;
    height: 40px;
    color: $mint-black;
    background-color: #fdfdfd;
    border: 1px solid #d9d9d9;
    border-radius: 30px;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 12px;
    padding: 7px 6px 7px 15px;
    cursor: pointer;
  }

  input[type="file"]::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }
  ::-webkit-file-upload-button {
    background: $mint-green;
    border: none;
    border-radius: 30px;
    color: $mint-blue;
    padding: 0px 10px;
    font-style: normal;
    font-weight: 800;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    float: right;
    cursor: pointer;
  }

  input {
    width: 100%;
    height: 40px;
    color: $mint-black;
    background-color: #fdfdfd;
    border: 1px solid #d9d9d9;
    border-radius: 30px;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 5px;
    padding: 7px;
    text-align: left;
  }

  input::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }

  input:read-only {
    color: #1a1a1a;
    border: 1px dashed #e0e0e0;
    letter-spacing: 1px;
    cursor: not-allowed;
  }

  input:focus {
    border: 1px solid $mint-green;
    outline: none;
  }

  textarea {
    width: 100%;
    color: $mint-black;
    background-color: #fdfdfd;
    border: 1px solid #d9d9d9;
    border-radius: 30px;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 5px;
    padding: 10px;
    text-align: left;
    resize: none;
  }

  textarea::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }

  textarea:focus {
    border: 1px solid $mint-green;
    outline: none;
  }

  .select-row {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    label.black {
      width: 100%;
      color: $mint-black;
      font-style: normal;
      font-weight: 800;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.1em;
      margin: 8px 0 2px 15px;
      text-align: left;
    }
  }
  select.bridge-from-chain {
    width: 100%;
    color: $mint-blue;
    background-color: #ffffff;
    border: 1px solid $mint-blue;
    border-radius: 30px;
    letter-spacing: 1px;
    font-size: 13px;
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
  select.bridge-from-chain::placeholder {
    color: $mint-blue;
    letter-spacing: 1px;
  }
  select.bridge-from-chain:focus {
    border: 1px solid $mint-black;
    outline: none;
  }

  .bridge-step-one {
    width: 100%;
    color: $mint-black;
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
    margin: 8px 0 2px 15px;
    text-align: left;
  }

  select.bridge-to-chain {
    width: 100%;
    color: $mint-blue;
    background-color: #ffffff;
    border: 1px solid $mint-blue;
    border-radius: 30px;
    letter-spacing: 1px;
    font-size: 13px;
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
  select.bridge-to-chain::placeholder {
    color: $mint-blue;
    letter-spacing: 1px;
  }
  select.bridge-to-chain:focus {
    border: 1px solid $mint-black;
    outline: none;
  }

  .button-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .mint-button {
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
  .mint-button:disabled {
    background: #c6c6c6;
    color: #101010;
    cursor: not-allowed;
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
    margin: 10px 1% 10px 0;
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
  .bridge-button-left {
    color: $white;
    background-color: $mint-blue;
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
      color: $mint-black;
    }
  }
  .bridge-button-left:disabled {
    background: #c6c6c6;
    color: #101010;
    cursor: not-allowed;
  }
  .bridge-button-right {
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
    &:hover {
      color: $mint-black;
    }
  }

  .back-button {
    color: $white;
    background-color: $mint-black;
    font-size: 18px;
    font-weight: bold;
    width: 48%;
    height: 55px;
    border: 0;
    border-radius: 30px;
    margin: 10px 0 10px 1%;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
      color: $mint-blue;
    }
  }
}

.bubbles-brewing {
  background-image: url("./brewingbubbles.svg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 700px;
  @include breakpoint($break-md) {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  @include breakpoint($break-sm) {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 600px;
  }
  @include breakpoint($break-xs) {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
.bubbles-one {
  background-image: url("./bubbles1.svg");
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 700px;
}
.bubbles-two {
  background-image: url("./bubbles2.svg");
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 700px;
}
.bubbles-three {
  background-image: url("./bubbles3.svg");
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 700px;
}
.bubbles-four {
  background-image: url("./bubbles4.svg");
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 700px;
}
.bubbles-five {
  background-image: url("./bubbles5.svg");
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 700px;
}

section#nft-modal {
  min-height: 720px;
  color: $mint-black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: center;

  padding: 0;

  @include breakpoint($break-md) {
    padding: 20px 0;
  }
  @include breakpoint($break-sm) {
    padding: 20px 0;
  }
  @include breakpoint($break-xs) {
    padding: 20px 0;
  }

  .nft-modal-loading {
    width: 600px;
    height: 100%;
    min-height: 720px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 0;
    @include breakpoint($break-xl) {
      width: 100%;
      padding: 0 auto;
    }
    @include breakpoint($break-lg) {
      width: 100%;
      padding: 0;
    }
    @include breakpoint($break-md) {
      width: 100%;
      padding: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 100%;
      padding: 0;
    }
    @include breakpoint($break-xs) {
      width: 100%;
      padding: 0;
    }
  }

  .nft-modal-card {
    width: 600px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background: #f4f4f4;
    border: 4px solid var(--gradient-100);
    box-shadow: 2px 2px 25px 6px rgba(43, 43, 43, 0.1);
    border-radius: 10px;
    padding: 20px 20px 10px 20px;
    @include breakpoint($break-lg) {
      width: 89%;
      padding: 20px 20px 10px 20px;
    }
    @include breakpoint($break-md) {
      width: 81%;
      padding: 20px 20px 10px 20px;
    }
    @include breakpoint($break-sm) {
      width: 81%;
      padding: 20px 20px 10px 20px;
    }
    @include breakpoint($break-xs) {
      width: 100%;
      padding: 20px 20px 10px 20px;
    }
  }

  .nft-modal-video {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background: #f4f4f4;
  }
  .nft-modal-image {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;

    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      overflow: hidden;
    }
  }

  .nft-modal-title {
    width: 100%;
    color: $mint-black;
    font-size: 1.7rem;
    font-weight: 400;
    text-align: center;
    margin: 10px auto 0;
  }

  .nft-modal-description {
    color: $mint-black;
    width: 100%;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    margin: 10px auto 0;
  }
  .nft-modal-contract-address {
    color: #1a1a1a;
    width: 100%;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    margin: 10px auto 0;
  }

  .nft-modal-image-url {
    width: 50%;
    margin: 0 auto 10px;
    display: flex;
    flex-flow: row;
    justify-content: space-evenly;
    .file-image-url {
      background: $mint-blue;
      border: none;
      border-radius: 30px;
      padding: 2px 12px;
      cursor: pointer;
      a {
        color: $white;
        font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans",
          "Droid Sans", "Helvetica Neue", sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        transition: 0.4s;
        &:hover {
          color: $mint-black;
        }
      }
    }
    .file-copy-url {
      background: $mint-black;
      border: none;
      border-radius: 30px;
      padding: 2px 12px;
      cursor: pointer;
      a {
        color: $white;
        font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans",
          "Droid Sans", "Helvetica Neue", sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        transition: 0.4s;
        &:hover {
          color: $mint-blue;
        }
      }
    }
  }
}
.nft-bridge-tokens {
  width: 95%;
  height: 700px;
  color: $mint-black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #f4f4f4;
  border: 4px solid var(--gradient-100);
  box-shadow: 2px 2px 25px 6px rgba(43, 43, 43, 0.1);
  border-radius: 10px;
  padding: 20px 20px 10px 20px;
  overflow: scroll;

  @include breakpoint($break-lg) {
    padding: 0 0 3em 1em;
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
      font-size: 28px;
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

.nft-bridge-modal-card {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #f4f4f4;
  border: 4px solid var(--gradient-100);
  box-shadow: 2px 2px 25px 6px rgba(43, 43, 43, 0.1);
  border-radius: 10px;
  padding: 20px 20px 10px 20px;
  @include breakpoint($break-lg) {
    width: 89%;
    padding: 20px 20px 10px 20px;
  }
  @include breakpoint($break-md) {
    width: 81%;
    padding: 20px 20px 10px 20px;
  }
  @include breakpoint($break-sm) {
    width: 81%;
    padding: 20px 20px 10px 20px;
  }
  @include breakpoint($break-xs) {
    width: 100%;
    padding: 20px 20px 10px 20px;
  }

  .nft-bridge-modal-video {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background: #f4f4f4;
  }
  .nft-bridge-modal-image {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;

    img,
    svg {
      width: 100%;
      max-width: 560px;
      height: 100%;
      object-fit: contain;
      overflow: hidden;
    }
  }

  .nft-bridge-modal-title {
    width: 100%;
    color: $mint-black;
    font-size: 1.7rem;
    font-weight: 400;
    text-align: center;
    margin: 10px auto 0;
  }

  .nft-bridge-modal-tokenId {
    color: $mint-black;
    width: 100%;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    margin: 10px auto 0;
  }
  .nft-bridge-modal-contract-address {
    color: #1a1a1a;
    width: 100%;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    margin: 10px auto 5px;
  }
  .nft-bridge-modal-approve {
    width: 50%;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
    .approve-button {
      color: $white;
      background-color: $mint-blue;
      font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-style: normal;
      font-weight: 800;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      width: 100px;
      border-radius: 30px;
      padding: 4px 12px;
      height: auto;
      border: 0;
      margin: 10px;
      transition: 0.4s;
      cursor: pointer;
      &:hover {
        color: $mint-black;
      }
    }
    .approved-button {
      color: $black;
      background-color: $mint-green;
      font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-style: normal;
      font-weight: 800;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      width: 100px;
      border-radius: 30px;
      padding: 4px 12px;
      height: auto;
      border: 0;
      margin: 10px;
      transition: 0.4s;
      cursor: not-allowed;
      &:hover {
        color: $mint-black;
      }
    }
    .cancel-button {
      color: $white;
      background-color: $mint-black;
      font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-style: normal;
      font-weight: 800;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      width: 100px;
      border-radius: 30px;
      padding: 4px 12px;
      height: auto;
      border: 0;
      margin: 10px;
      transition: 0.4s;
      cursor: pointer;
      &:hover {
        color: $mint-blue;
      }
    }
  }
}

section#collections {
  width: 100%;
  color: $mint-black;
  background: $mint-blue;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding: 3em 0;

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
    flex-direction: row;
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
</style>
