<template>
  <header id="header">
    <div class="header-title">
      <router-link :to="{ name: 'home' }">
        <BlueLogo />
      </router-link>
    </div>
    <div class="header-menu" :class="$route.name === 'home' ? 'bg-pink' : ''">
      <nav>
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >home</router-link
        >
        <router-link
          :to="{ name: 'home', hash: '#about' }"
          active-class="active"
          exact
          >about</router-link
        >
        <router-link :to="{ name: 'explore' }" active-class="active" exact
          >explore</router-link
        >
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;

  @include breakpoint($break-md) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-bottom: 20px;
  }
  @include breakpoint($break-sm) {
    margin-bottom: 20px;
  }

  .header-title {
    width: 43%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;

    @include breakpoint($break-md) {
      width: 100%;
    }

    img,
    svg {
      width: 240px;
      margin: 40px auto -20px;
      object-fit: contain;
      overflow: hidden;
      @include breakpoint($break-md) {
        width: 220px;
        margin: 30px auto 10px;
      }
      @include breakpoint($break-sm) {
        width: 190px;
        margin: 30px auto 10px;
      }
    }
  }

  .bg-pink {
    background: $mint-pink;
    @include breakpoint($break-md) {
      background: none;
    }
    @include breakpoint($break-sm) {
      background: none;
    }
  }
  .header-menu {
    width: 57%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 0 0 0 5em;
    @include breakpoint($break-md) {
      width: 100%;
    }
    @include breakpoint($break-sm) {
      width: 100%;
    }

    nav {
      display: flex;
      align-items: center;
      text-align: right;
      margin-right: 50px;
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 5px auto;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
      }
      @include breakpoint($break-md) {
        width: 100%;
        margin: 0 auto;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
      }
      @include breakpoint($break-sm) {
        width: 100%;
        margin: 10px auto;
        text-align: center;
        justify-content: center;
        align-items: center;
        align-content: center;
      }
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
        }
        &.focus {
          font-weight: bold;
        }
        &.active {
          font-weight: bold;
        }
        @include breakpoint($break-sm) {
          font-size: 18px;
          line-height: 19px;
          margin: 0 10px;
          padding-bottom: 2px;
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
