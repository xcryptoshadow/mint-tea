<template>
  <header id="header">
    <div class="header-menu">
      <nav>
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >Home</router-link
        >
        <router-link :to="{ name: 'marketplace' }" active-class="active" exact
          >Marketplace</router-link
        >
        <router-link
          v-if="account"
          :to="{ name: 'account' }"
          active-class="active"
          exact
          >Account</router-link
        >
        <!-- <button v-if="account" class="balance-button">
          {{ balance ? balance : 0 }}
        </button> -->
      </nav>
    </div>
  </header>
</template>
<script>
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
import ConnectButtonIcon from "../assets/svgs/ConnectButtonIcon.vue";

/* LFG */
export default {
  name: "AppHeader",
  components: [ConnectButtonIcon],
  setup() {
    /* Init Pinia Store */
    const store = useStore();
    const { account, balance } = storeToRefs(store);

    return {
      account,
      balance,
    };
  },
};
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

header {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .header-menu {
    display: flex;
    align-items: flex-end;
    margin: 25px 55px 0 0;

    nav {
      display: flex;
      align-items: flex-end;
      text-align: right;
      a {
        color: $mint-black;
        margin-right: 20px;
        padding-bottom: 5px;
        text-decoration: none;
        border-bottom: 1px solid;
        cursor: pointer;
        &.active {
          font-weight: bold;
        }
      }
      .balance-button {
        min-width: 30px;
        height: 30px;
        color: $mint-black;
        background-color: #fff;
        font-size: 16px;
        font-weight: bold;
        border: 1px solid $mint-black;
        border-radius: 40px;
      }
    }
  }
}
</style>
