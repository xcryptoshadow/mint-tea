<template>
  <header id="header">
    <!-- <div class="header-title">
      <router-link :to="{ name: 'home' }">
        <BlueLogo class="header-logo" />
      </router-link>
    </div> -->
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
      </nav>
    </div>
  </header>
</template>
<script setup>
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
// import BlueLogo from "../assets/svgs/BlueLogo.vue?component";
/* Init Pinia Store */
const store = useStore();
const { account } = storeToRefs(store);
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

header {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  // .header-title {
  //   img,
  //   svg {
  //     width: 120px;
  //     object-fit: contain;
  //     overflow: hidden;
  //   }

  //   .header-logo {
  //     margin: 8px 0 0 10px;
  //   }
  // }

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
