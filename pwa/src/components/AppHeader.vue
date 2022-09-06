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
        <button v-if="account" class="balance-button">
          {{ balance ? balance : 0 }}
        </button>
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
  height: 10vh;

  .header-menu {
    display: flex;
    align-items: flex-end;

    nav {
      display: flex;
      align-items: flex-end;
      text-align: right;
      padding: 0.3em;

      a {
        color: var(--contrast-color);
        margin-right: 20px;
        padding-bottom: 6px;
        text-decoration: none;
        border-bottom: 1px solid;
        cursor: pointer;
        &.active {
          font-weight: bold;
        }
      }
      .balance-button {
        min-width: 40px;
        color: $mint-black;
        background-color: #fff;
        font-size: 18px;
        font-weight: bold;
        width: auto;
        height: 40px;
        border: 1px solid $mint-black;
        border-radius: 40px;
        margin-right: 10px;
      }
    }
  }
}
</style>
