<template>
  <main>
    <!-- Left Side -->
    <article>
      <section id="content">
        <!-- Connect Tab -->
        <div v-if="!account" class="form-container">
          <h1>Let's go brew</h1>
          <p>
            Mint and brew cross-chain NFTs using our custom bridge, send tokens
            and NFTs to all your favourite blockchains.
          </p>
          <p>
            Mint and brew cross-chain NFTs using our custom bridge, send tokens
            and NFTs to all your favourite blockchains.
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
        <div v-if="account && formTab === 'bridge'" class="form-container">
          <h1>Bridge NFT</h1>
          <div class="input-row">
            <p>
              Bridge your NFT to different chains, your token will be minted on
              the destination chain and burned on source chain
            </p>
          </div>
          <div class="button-container mb-10">
            <button class="bridge-button" @click="bridgeNFT()">Bridge</button>
          </div>
          <div class="button-container">
            <button class="back-button" @click="switchTab('mint')">Back</button>
          </div>
        </div>

        <!-- Mint Tab -->
        <div v-if="account && formTab === 'mint'" class="form-container">
          <h1>Mint NFT</h1>
          <div class="input-row">
            <label for="file">Upload file</label>
            <input
              type="file"
              name="file"
              ref="fileRef"
              placeholder="PNG, JPG, GIF, SVG or MP4"
              @change="uploadFileHandler()"
            />
          </div>
          <!-- <div class="input-row">
            <label for="imageUrl">Image URL</label>
            <input type="text" name="imageUrl" v-model="imageUrl" readonly />
          </div>
          <div class="input-row">
            <label for="audioVideoType">Audio/Video Type</label>
            <input
              type="text"
              name="audioVideoType"
              v-model="audioVideoType"
              readonly
            />
          </div>
          <div class="input-row">
            <label for="size">File Size</label>
            <input type="text" name="size" v-model="size" readonly />
          </div>
          <div class="input-row">
            <label for="createdAt">Created At</label>
            <input type="text" name="createdAt" v-model="createdAt" readonly />
          </div>
          <div class="input-row">
            <label for="tokenId">Token ID</label>
            <input type="text" name="tokenId" v-model="tokenId" />
          </div>
          <div class="input-row">
            <label for="cid">IPFS CID</label>
            <input type="text" name="cid" v-model="cid" />
          </div> -->
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
          <div class="button-container mb-10">
            <button
              v-if="!tokenId"
              :disabled="!account"
              class="mint-button"
              @click="mintNFT()"
            >
              Mint
            </button>
          </div>
          <div class="button-container">
            <button class="bridge-button" @click="switchTab('bridge')">
              Bridge
            </button>
          </div>
        </div>
        <!-- END Mint Tab -->
      </section>
    </article>
    <!-- END Left Side -->
    <!-- Right Side -->
    <aside>
      <section id="nft-modal">
        <div v-if="!imageUrl" class="nft-modal-loading"><RippleEffectBG /></div>
        <div v-if="imageUrl" class="nft-modal-card">
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
          <div class="nft-modal-description">
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
            <div class="file-image-url">
              <a
                title="Copy to clipboard"
                target="_blank"
                @click="copyFileLink(imageUrl)"
              >
                Copy Link
              </a>
            </div>
          </div>
          <div class="nft-modal-file-type">
            <div class="file-type">{{ audioVideoType }}</div>
          </div>
          <div class="nft-modal-file-size">
            <div class="file-size">{{ size }}</div>
          </div>
        </div>
      </section>
    </aside>
    <!-- END Right Side -->
    <section id="collections">
      <div class="row-header">
        <h2>Minty fresh<ArrowDownWhite class="arrow-down" /></h2>
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
        <template v-for="token in anneTokens" :key="token.token_id">
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
    <section id="music">
      <div class="row-header">
        <h2>Latest beats<ArrowDownBlack class="arrow-down" /></h2>
      </div>
      <div class="row token-list">
        <!-- Music NFT by Kerem -->
        <div
          v-if="keremTokens && keremTokens.length > 0"
          class="music-nft-container"
        >
          <template v-for="token in keremTokens" :key="token.contract">
            <MusicCard
              v-if="token.metadata && token.metadata.image"
              :token="token"
            />
          </template>
        </div>
      </div>
    </section>
    <section id="about">
      <div class="row-header">
        <h2>Team<ArrowDownBlack class="arrow-down" /></h2>
      </div>
      <div class="row token-list">
        <div class="about-box">
          <div class="team-box">
            <div class="team-image"><img src="" alt="Name" /></div>
            <div class="team-name">Name here</div>
            <div class="team-job">Job here</div>
            <div class="team-links">
              <a href="#">Link Here</a>
              <a href="#">Link Here</a>
              <a href="#">Link Here</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import moment from "moment";

/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";

/* Import our IPFS and NftStorage Services */
import { uploadBlob } from "../services/ipfs.js";
import { fileSize, copyToClipboard, generateLink } from "../services/helpers";
// import { nftStorage } from "../services/nftStorage.js";
// import authNFT from "../services/authNFT.js";

/* Import SVG */
import ArrowDownWhite from "../assets/svgs/ArrowDownWhite.vue?component";
import ArrowDownBlack from "../assets/svgs/ArrowDownBlack.vue?component";
import RippleEffectBG from "../assets/svgs/RippleEffectBG.vue?component";

/* Components */
import NftCard from "@/components/NftCard.vue";
import MusicCard from "@/components/MusicCard.vue";

/* Import Smart Contract ABI */
import contractAbi from "../../../artifacts/contracts/mint_tea_ERC721.sol/MTEA.json";
/* Mint Tea Contract Address */
const contractAddress = "0x8d57FfB931426aAa612591F846BD00d6c580A59c";

/* Console log with some style */
const stylesContract = ["color: black", "background: #e9429b"].join(";");
console.log(
  "%c🍵 Mint Tea Contract Address %s",
  stylesContract,
  contractAddress
);
const stylesAbi = ["color: black", "background: cyan"].join(";");
console.log("%c🧭 Contract ABI Source %s", stylesAbi, contractAbi.sourceName);

// Init Store
const store = useStore();

// Store Values and Methods
const { account, topTokens, latestTokens, anneTokens, keremTokens } =
  storeToRefs(store);

// Set Form Tab
const formTab = ref("mint");

// File Uploader
const fileRef = ref(null);

// NFT Form Metadata fields
const tokenId = ref("");
const cid = ref("");

// Visible on form, above hidden on form
const name = ref("");
const description = ref("");
const imageUrl = ref(null);
const externalUrl = ref("");
const animationUrl = ref("");
const youtubeUrl = ref("");
const attributes = ref([]);

// Calculated on Mint and IPFS upload
const size = ref("");
const createdAt = ref("");
const audioVideoType = ref("");

/**
 * Switch Tab
 */
const switchTab = (value) => {
  formTab.value = value;
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
  console.log("file:", file[0]);
  store.setLoading(true);
  const uploadResult = await uploadBlob(file[0]);
  console.log("uploadResult:", uploadResult);

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
        console.log("receiver ", receiver);

        createdAt.value = moment.unix(timestamp).toString();
        console.log("createdAt.value ", createdAt.value);

        let tokenIdBigNo = new BigNumber(newTokenId);

        console.log("tokenId ", tokenIdBigNo);
        tokenId.value = newTokenId.toNumber();
        console.log("tokenId.value ", tokenId.value);
      });

      /* Store NFT Metadata on NFT.Storage */
      // const nftStorageTMetadataURI = await nftStorage(
      //   name.value,
      //   description.value,
      //   imageUrl.value,
      //   externalUrl.value,
      //   animationUrl.value,
      //   youtubeUrl.value,
      //   attributes.value,
      //   audioVideoType.value
      // );
      // const stylesNFTStorage = ["color: black", "background: #f23f3f"].join(
      //   ";"
      // );
      // console.log(
      //   "%c💾 NFT.Storage ipfs:// link :  %s 💾",
      //   stylesNFTStorage,
      //   nftStorageTMetadataURI
      // );
      /* Check our Transaction results */
      // if (!nftStorageTMetadataURI) return;

      /* Mint our NFT using custom structure */
      // let nftTxn = await contract.safeMint(
      //   signer.getAddress(),
      //   nftStorageTMetadataURI
      // );

      const mintDate = new Date();
      const mintDateTimestamp = mintDate.getTime();
      // const mintDateBigNo = new BigNumber(mintDateTimestamp);

      // console.log("mintDateBigNo:", mintDateBigNo);

      let nftTxn = await contract.safeMint(
        signer.getAddress(),
        name.value,
        description.value,
        imageUrl.value,
        externalUrl.value,
        "https://cloudflare-ipfs.com/ipfs/bafkreibx3akdct6syqhkis3dqsnekukhh5ib5pdwepfki7hf45viv4ylp4",
        "date",
        "🍵 Brewed by Mint Tea",
        mintDateTimestamp
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

onMounted(async () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  getAccount();
  await checkIfWalletIsConnected();

  /* Kerems Music NFT Video */
  if (keremTokens.value.length === 0) {
    let keremTokens = await store.detailsNftSearch(
      "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405",
      "52806",
      "ethereum",
      true
    );
    if (keremTokens.nft) {
      store.addKeremTokens(...[keremTokens.nft]);
    }
    let keremTokens2 = await store.detailsNftSearch(
      "0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405",
      "108227",
      "ethereum",
      true
    );
    if (keremTokens2.nft) {
      store.addKeremTokens(...[keremTokens2.nft]);
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
});
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

article {
  width: 40%;
  flex-grow: 1 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3em 5em;
  @include breakpoint($break-lg) {
    padding: 1em;
  }
  @include breakpoint($break-md) {
    padding: 0.5em;
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
aside {
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0 0 0 50px;
  background: $mint-pink;
  @include breakpoint($break-lg) {
    padding: 0;
  }
  @include breakpoint($break-md) {
    padding: 0;
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

section#content {
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    width: 380px;
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

    .mb-10 {
      margin-bottom: 10px;
    }
  }

  .input-row {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 5px;
    width: 100%;
  }

  .hidden {
    display: none;
  }

  label {
    color: #23073c;
    font-family: "RalewayBold";
    font-style: bold;
    font-weight: 700;
    font-size: 18px;
    line-height: 23px;
    margin-bottom: 4px;
  }

  input[type="file"] {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 1px dashed #fde2db;
    border-radius: 2px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 100%;
    margin-bottom: 5px;
    padding: 7px;
    cursor: pointer;
  }
  ::-webkit-file-upload-button {
    background: #23073c;
    border: none;
    border-radius: 35px;
    color: #ffffff;
    padding: 8px 10px;
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: flex-end;
    text-align: center;
  }

  input {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 1px dashed #fde2db;
    border-radius: 2px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 100%;
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
    letter-spacing: 2px;
    cursor: not-allowed;
  }

  input:focus {
    border: 1px solid #fde2db;
    outline: none;
  }

  textarea {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 1px dashed #fde2db;
    border-radius: 1px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 100%;
    margin-bottom: 5px;
    padding: 10px;
    text-align: center;
  }

  textarea::placeholder {
    color: #a8a8a8;
    letter-spacing: 1px;
  }

  textarea:focus {
    border: 1px solid #fde2db;
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

  .button-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    background-color: $mint-green;
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
    width: 48%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin: 10px 1% 10px 0;
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
    width: 48%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin: 10px 1% 10px 0;
    a {
      color: $white;
      text-decoration: none;
      border-bottom: none;
      &:hover {
        color: $black;
      }
    }
  }

  .back-button {
    color: $white;
    background-color: $mint-black;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    transition: 0.4s;
    cursor: pointer;
  }
  .brew-button {
    color: $white;
    background-color: $mint-orange;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin-right: 1%;
    transition: 0.4s;
    cursor: pointer;
  }
  .bridge-button {
    color: $white;
    background-color: $mint-blue;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 55px;
    border: 0;
    border-radius: 10px;
    transition: 0.4s;
    cursor: pointer;
  }
}

section#nft-modal {
  height: inherit;
  color: $mint-black;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
  padding: 0 0 4em 3em;
  overflow: scroll;
  @include breakpoint($break-lg) {
    padding: 0;
  }
  @include breakpoint($break-md) {
    padding: 0;
  }
  @include breakpoint($break-sm) {
    padding: 0;
  }
  @include breakpoint($break-xs) {
    padding: 0;
  }

  .nft-modal-loading {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    width: 700px;
    padding: 0;
    @include breakpoint($break-lg) {
      width: 100%;
      padding: 0;
    }
    @include breakpoint($break-md) {
      width: 100%;
    }
    @include breakpoint($break-sm) {
      width: 100%;
    }
    @include breakpoint($break-xs) {
      width: 100%;
    }
  }

  .nft-modal-card {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 600px;
    background: #f4f4f4;
    border-radius: 10px;
    padding: 20px 20px 10px 20px;
    @include breakpoint($break-lg) {
      width: 100%;
    }
    @include breakpoint($break-md) {
      width: 100%;
    }
    @include breakpoint($break-sm) {
      width: 100%;
    }
    @include breakpoint($break-xs) {
      width: 100%;
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
    text-transform: uppercase;
    margin: 0;
  }

  .nft-modal-description {
    color: #1a1a1a;
    width: 100%;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    margin: 0;
  }

  .nft-modal-image-url {
  }

  .nft-modal-file-type {
  }

  .nft-modal-file-size {
  }

  // .mint-button {
  //   color: #fff;
  //   background-color: $mint-black;
  //   font-size: 18px;
  //   font-weight: bold;
  //   width: 100%;
  //   max-width: 360px;
  //   height: 55px;
  //   border: 0;
  //   padding-left: 87px;
  //   padding-right: 87px;
  //   border-radius: 10px;
  //   transition: 0.4s;
  //   cursor: pointer;
  // }

  // .mint-button:disabled {
  //   background: #c6c6c6;
  //   color: $mint-orange;
  //   cursor: not-allowed;
  // }
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
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
      margin: 0 auto;
    }
    h2 {
      width: 100%;
      color: $mint-pink;
      font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 36px;
      line-height: 42px;
      text-align: left;
      margin: 0 0 10px 20px;
      .arrow-down {
        margin-bottom: -5px;
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
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
      margin: 0 auto;
    }
  }
}

section#music {
  width: 100%;
  color: $mint-black;
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
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
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
      margin: 0 0 10px 20px;
      .arrow-down {
        margin-bottom: -5px;
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
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
      margin: 0 auto;
    }
  }

  .music-nft-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 0;

    h1 {
      font-family: Roboto, Ubuntu, "Open Sans", "Helvetica Neue", sans-serif;
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

section#about {
  width: 100%;
  color: $mint-black;
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
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
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
      margin: 0 0 10px 20px;
      .arrow-down {
        margin-bottom: -5px;
      }
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .token-list {
    width: 100%;
    max-width: 1280px;
    display: inline-block;
    margin: 0 auto;
    @include breakpoint($break-md) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-sm) {
      width: 90%;
      margin: 0 auto;
    }
    @include breakpoint($break-xs) {
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
