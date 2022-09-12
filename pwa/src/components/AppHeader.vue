<template>
  <header id="header">
    <div class="header-title">
      <router-link :to="{ name: 'home' }">
        <BlueLogo class="header-logo" />
      </router-link>
    </div>
    <div class="header-menu">
      <nav>
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >home</router-link
        >
        <router-link :to="{ name: 'marketplace' }" active-class="active" exact
          >marketplace</router-link
        >
        <a href="#about">about</a>
        <router-link
          v-if="account"
          :to="{ name: 'account' }"
          active-class="active"
          exact
          >account</router-link
        >
      </nav>
    </div>
  </header>
</template>
<script setup>
/* Import our Pinia Store & Refs */
import { storeToRefs } from "pinia";
import { useStore } from "../store";
import BlueLogo from "../assets/svgs/BlueLogo.vue?component";
/* Init Pinia Store */
const store = useStore();
const { account } = storeToRefs(store);
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  overflow: show;

  .header-title {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    img,
    svg {
      width: 240px;
      object-fit: contain;
      overflow: hidden;
    }

    .header-logo {
      margin: 40px auto -20px;
    }
  }

  .header-menu {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: #fbe2ff;

    nav {
      display: flex;
      align-items: center;
      text-align: right;
      margin-right: 50px;
      a {
        color: $mint-blue;
        font-family: Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans",
          "Droid Sans", "Helvetica Neue", sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 22px;
        line-height: 29px;
        margin-right: 30px;
        padding-bottom: 2px;
        text-decoration: none;
        border-bottom: 1px solid $mint-blue;
        transition: 0.3s;
        cursor: pointer;
        &.hover {
          font-weight: bold;
          border-bottom: 1px solid $mint-black;
        }
        &.active {
          font-weight: bold;
          border-bottom: 1px solid $mint-black;
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
