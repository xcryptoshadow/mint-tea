<script setup>
/* Init our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
const store = useStore();
const { account, balance, loading } = storeToRefs(store);

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
</script>
<template>
  <div class="button-container">
    <button v-if="!account" @click="connectWallet" class="connect-button">
      {{ loading ? "Loading " : "Connect" }}
    </button>
    <button v-if="account" class="balance-button">
      {{ balance ? balance : 0 }}
    </button>
    <button v-if="account" class="profile-button">Profile</button>
  </div>
</template>
<style scoped>
.button-container {
  display: flex;
  flex-direction: row;
}
.connect-button {
  min-width: 300px;
  color: #000;
  background-color: #08d0a5;
  font-size: 18px;
  font-weight: bold;
  width: auto;
  height: 55px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}
.balance-button {
  min-width: 50px;
  color: #000;
  background-color: #fff;
  font-size: 18px;
  font-weight: bold;
  width: auto;
  height: 55px;
  border: 0;
  border-radius: 5px;
}
.profile-button {
  min-width: 300px;
  color: #000;
  background-color: #08d0a5;
  font-size: 18px;
  font-weight: bold;
  width: auto;
  height: 55px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}
</style>
