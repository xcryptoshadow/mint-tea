<template>
  <main>
    <article>
      <section id="content">
        <div class="form-container">
          <h2>Mint NFT</h2>
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
          <div class="button-container">
            <button
              v-if="!tokenId"
              :disabled="!account"
              class="mint-button"
              @click="mintNFT()"
            >
              Mint
            </button>
          </div>
        </div>
      </section>
    </article>
    <aside>
      <section id="marketplace">
        <!-- Ethereum -->
        <h2 v-if="ethereumTokens.length > 0">Ethereum NFT Tokens</h2>
        {{ ethereumTokens }}
        <!-- <div v-if="ethereumTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in ethereumTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Polygon -->
        <h2 v-if="polygonTokens.length > 0">Polygon NFT Tokens</h2>
        {{ polygonTokens }}
        <!-- <div v-if="polygonTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in polygonTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Optimism -->
        <!-- {{ optimismTokens }}
        <h2 v-if="optimismTokens.length > 0">Optimism NFT Tokens</h2>
        <div v-if="optimismTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in optimismTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->

        <!-- Arbitrum -->
        <!-- {{ arbitrumTokens }}
        <h2 v-if="arbitrumTokens.length > 0">Arbitrum NFT Tokens</h2>
        <div v-if="arbitrumTokens.length > 0" class="row token-list">
          <NftCard
            v-for="token in arbitrumTokens"
            :key="token.tokenId"
            :token="token"
          />
        </div> -->
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

/* Components */
// import NftCard from "@/components/NftCard.vue";

/* Import Smart Contract ABI */
import contractAbi from "../../../artifacts/contracts/Lock.sol/Lock.json";
/* Manually set our Contract Address */
const contractAddress = "0x6b9482bD2EEd7814EE5a88Cc93f687a3961D27Fb";

/* Console log with some style */
const stylesContract = ["color: black", "background: #e9429b"].join(";");
console.log(
  "%c🏦 Mojo Contract Address %s 🏦",
  stylesContract,
  contractAddress
);
const stylesAbi = ["color: black", "background: cyan"].join(";");
console.log(
  "%c🧭 Contract ABI Source %s 🧭",
  stylesAbi,
  contractAbi.sourceName
);

// Init Store
const store = useStore();

// Store Values and Methods
const {
  account,
  ethereumTokens,
  polygonTokens,
  optimismTokens,
  arbitrumTokens,
} = storeToRefs(store);

// Set Form Tab
// const formTab = ref("one");

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

/* Fetch new NFT audio/media by Category or Name */
async function fetchTokens() {
  try {
    await store.fetchNFTs(
      "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      "shokumotsu-foodlove",
      "137"
    );

    const stylesEthereum = ["color: black", "background: grey"].join(";");
    console.log(
      "%c📻 Ethereum NFTs fetched : %s 📻",
      stylesEthereum,
      JSON.stringify(ethereumTokens.value)
    );

    const stylesPolygon = ["color: black", "background: purple"].join(";");
    console.log(
      "%c📻 Polygon NFTs fetched : %s 📻",
      stylesPolygon,
      JSON.stringify(polygonTokens.value)
    );

    const stylesOptimism = ["color: black", "background: red"].join(";");
    console.log(
      "%c📻 Optimism NFTs fetched : %s 📻",
      stylesOptimism,
      JSON.stringify(optimismTokens.value)
    );

    const stylesArbitrum = ["color: black", "background: yellow"].join(";");
    console.log(
      "%c📻 Arbitrum NFTs fetched : %s 📻",
      stylesArbitrum,
      JSON.stringify(arbitrumTokens.value)
    );
  } catch (error) {
    console.log(error);
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
  /* Strip image type off our name eg, .png, .jpeg */
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
        contractAbi.abi,
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
  await checkIfWalletIsConnected();
  await fetchTokens();
});
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    width: 300px;
    border: 4px solid var(--gradient-100);
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    padding: 20px;

    h2 {
      font-size: 1.4rem;
      line-height: 1.5rem;
      text-align: center;
      padding-bottom: 2px;
      text-decoration: none;
      border-bottom: 1px solid;
      margin: 0 auto 10px;
    }
  }

  input {
    color: #1a1a1a;
    background-color: #fdfdfd;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    letter-spacing: 1px;
    font-size: 14px;
    width: 260px;
    margin-bottom: 10px;
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
    width: 300px;
    margin-bottom: 10px;
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

  .mint-button {
    color: #fff;
    background-color: #08d0a5;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    max-width: 360px;
    height: 55px;
    border: 0;
    padding-left: 97px;
    padding-right: 97px;
    border-radius: 10px;
    cursor: pointer;
  }

  .mint-button:disabled {
    background: #c6c6c6;
    color: #101010;
    cursor: not-allowed;
  }
}
</style>
