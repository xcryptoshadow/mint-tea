<template>
  <main>
    <article>
      <section id="content">
        <!-- Connect Tab -->
        <div v-if="!account" class="form-container">
          <!-- <h1>Mint Tea</h1> -->
          <BlueLogo class="header-logo" />
          <p>
            Mint and brew cross-chain NFTs using our custom bridge, send tokens
            and NFTs to all your favourite blockchains.
          </p>
          <p>
            Search and verify your NFTs for rarity by name, description and
            image across all blockchains.
          </p>

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
        <!-- Brew & Bridge Tab -->
        <div v-if="account && formTab === 'brew'" class="form-container">
          <h1>Brew NFT</h1>
          <div class="input-row">
            <p>
              Brew your NFT and send a wrapped version to your selected chains.
              The NFT will be locked and a new wrapped version minted on the
              parent chain for use.
            </p>
          </div>
          <div class="button-container mb-10">
            <button class="back-button" @click="switchTab('mint')">Back</button>
            <button class="brew-button" @click="brewNFT()">Brew</button>
          </div>
          <div class="button-container">
            <button class="bridge-button" @click="switchTab('bridge')">
              Bridge
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
            <button class="back-button" @click="switchTab('brew')">Back</button>
            <button class="bridge-button" @click="bridgeNFT()">Bridge</button>
          </div>
          <div class="button-container">
            <button class="brew-button" @click="switchTab('brew')">Brew</button>
          </div>
        </div>
        <!-- Mint Tab -->
        <div v-if="account && formTab === 'mint'" class="form-container">
          <h1>Mint Tea</h1>
          <div class="input-row">
            <input type="file" ref="fileRef" @change="uploadFileHandler" />
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
          <div class="input-row">
            <input
              type="text"
              placeholder="Created"
              v-model="createdAt"
              readonly
            />
          </div>
          <div class="input-row">
            <input type="text" placeholder="Token ID" v-model="tokenId" />
          </div>
          <div class="input-row hidden">
            <input type="text" placeholder="IPFS CID" v-model="cid" />
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
              placeholder="Add an external link"
              v-model="externalUrl"
            />
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
          <div class="button-container mb-10">
            <button class="bridge-button" @click="switchTab('bridge')">
              Bridge
            </button>
          </div>
          <div class="button-container">
            <button class="brew-button" @click="switchTab('brew')">Brew</button>
          </div>
        </div>
        <!-- END Mint Tab -->

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
        <!-- <h2>Latest NFTs</h2> -->
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
    </aside>
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
import { fileSize, generateLink } from "../services/helpers";
import { nftStorage } from "../services/nftStorage.js";
// import authNFT from "../services/authNFT.js";

/* Import SVG */
import BlueLogo from "../assets/svgs/BlueLogo.vue?component";
/* Components */
import NftCard from "@/components/NftCard.vue";
import MusicCard from "@/components/MusicCard.vue";

/* Import Smart Contract ABI */
// import contractAbi from "../../../artifacts/contracts/Lock.sol/Lock.json";
/* Manually set our Contract Address */
const contractAddress = "0x6b9482bD2EEd7814EE5a88Cc93f687a3961D27Fb";

/* Console log with some style */
const stylesContract = ["color: black", "background: #e9429b"].join(";");
console.log(
  "%c🏦 Mint Tea Contract Address %s 🏦",
  stylesContract,
  contractAddress
);
// const stylesAbi = ["color: black", "background: cyan"].join(";");
// console.log(
//   "%c🧭 Contract ABI Source %s 🧭",
//   stylesAbi,
//   contractAbi.sourceName
// );

// Init Store
const store = useStore();

// Store Values and Methods
const { account, balance, topTokens, latestTokens, anneTokens, keremTokens } =
  storeToRefs(store);

// Set Form Tab
const formTab = ref("mint");

// File Uploader
const fileRef = ref(null);
// const isUploading = ref(false);

// NFT Form Metadata fields
const tokenId = ref("");
const cid = ref("");

// Visible on form, above hidden on form
const name = ref("");
const description = ref("");
const externalUrl = ref("");
const imageUrl = ref(null);

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

/**
 * @param {File} file
 * @returns {Object}
 */
const uploadFileHandler = async (file) => {
  /**
   * @dev Can try NFT.Storage here instead
   */
  const uploadResult = await uploadBlob(file);
  const { error } = uploadResult;
  if (error && error instanceof Error) {
    console.log(error.message);
    return uploadResult;
  }
  /* Set our NFT Metadata Form Values using IPFS best practises */
  cid.value = uploadResult.data.cid;
  /* Strip image type off our name eg, .png, .jpeg, .gif */
  name.value = uploadResult.data.file.name.substring(
    0,
    uploadResult.data.file.name.lastIndexOf(".")
  );
  /* Generate and IPFS URI for NFT's */
  imageUrl.value = generateLink(uploadResult.data);

  /* Set details from file upload */
  audioVideoType.value = uploadResult.data.file.type;
  size.value = fileSize(uploadResult.data.file.size);
  createdAt.value = uploadResult.data.file.created_at;

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
        // contractAbi.abi,
        signer
      );

      const styles = ["color: black", "background: green"].join(";");
      console.log(
        "%c🍵 Mint Tea Core Smart Contract Address:  %s ",
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
      const nftStorageTMetadataURI = await nftStorage(
        name.value,
        description.value,
        imageUrl.value,
        size.value,
        createdAt.value,
        audioVideoType.value
      );
      /* Console log with some style */
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
      let nftTxn = await contract.safeMint(
        signer.getAddress(),
        nftStorageTMetadataURI
      );
      // let nftTxn = await contract.safeMint(signer.getAddress());

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

  if (topTokens.value.length === 0) {
    let topTokens = await store.contractNftSearch(
      "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7",
      "ethereum",
      "metadata",
      "true",
      8,
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
      12,
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
      8,
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

  input {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 280px;
    margin-bottom: 5px;
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
    width: 280px;
    margin-bottom: 5px;
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

  .back-button {
    color: $white;
    background-color: $mint-green;
    font-size: 18px;
    font-weight: bold;
    height: 55px;
    border: 0;
    border-radius: 10px;
    margin-right: 10px;
    padding-left: 15px;
    padding-right: 15px;
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
