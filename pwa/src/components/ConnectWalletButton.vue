<script setup>
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
/* Import our IPFS and NftStorage Services */
import authNFT from "../services/authNFT.js";

defineProps({
  currentAccount: String,
  btnSize: {
    type: String,
    required: false,
  },
});
// Init Store & Refs
const store = useStore();
const { isAuthenticated, walletConnectionAttempted } = storeToRefs(store);

/* Connect Wallet method */
async function connectWallet() {
  const { ethereum } = window;
  store.setLoading(true);
  if (typeof ethereum !== "undefined") {
    store.setErrorMessage(false);
    try {
      if (!ethereum) {
        alert("Please connect 🦊 Metamask to continue!");
        return;
      }
      const [accountAddress] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accountAddress) {
        store.setWalletConnectionAttempted(true);
        const authAccount = new authNFT();
        const authed = await authAccount.authAccountAddress(accountAddress);
        if (authed) {
          store.setIsAuthenticated(authed);
          store.updateAccount(accountAddress);
        }
        emit("update:modelValue", accountAddress);
        store.setLoading(false);
      }
      console.log("Account Address", accountAddress);
    } catch (error) {
      console.log("Error", error);
      store.setIsAuthenticated(false);
      store.setWalletConnectionAttempted(true);
      store.setLoading(false);
    }
  } else {
    store.setErrorMessage(true);
  }
  store.setLoading(false);
}
function handleBackButtonClick() {
  store.setIsAuthenticated(false);
  store.setWalletConnectionAttempted(false);
}
function handleSuccessButtonClick() {
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["🌸", "🦄"],
    emojiSize: 100,
    confettiRadius: 10,
    confettiNumber: 100,
  });
}
</script>
<template>
  <div class="connect-wallet-container">
    <button
      v-if="!walletConnectionAttempted && btnSize === 'large'"
      @click="connectWallet"
      class="connect-wallet-button"
    >
      🎧 Connect Wallet
    </button>
    <button
      v-if="!walletConnectionAttempted && btnSize === 'small'"
      @click="connectWallet"
      class="connect-wallet-small-button"
    >
      🎧 Connect
    </button>

    <button
      v-if="walletConnectionAttempted && isAuthenticated && btnSize === 'large'"
      @click="handleSuccessButtonClick"
      class="connect-wallet-button"
    >
      🎧 Collection
    </button>
    <button
      v-if="walletConnectionAttempted && isAuthenticated && btnSize === 'small'"
      @click="handleSuccessButtonClick"
      class="connect-wallet-small-button"
    >
      🎧 Collection
    </button>

    <button
      v-if="
        walletConnectionAttempted && !isAuthenticated && btnSize === 'large'
      "
      @click="handleBackButtonClick"
      class="connect-wallet-button"
    >
      🎧 Go Back
    </button>
    <button
      v-if="
        walletConnectionAttempted && !isAuthenticated && btnSize === 'small'
      "
      @click="handleBackButtonClick"
      class="connect-wallet-small-button"
    >
      🎧 Go Back
    </button>
  </div>
</template>
