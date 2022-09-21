<template>
  <header id="header">
    <div class="header-menu">
      <nav>
        <router-link :to="{ name: 'home' }" active-class="active" exact
          >home</router-link
        >
        <router-link :to="{ name: 'explore' }" active-class="active" exact
          >explore</router-link
        >
        <router-link :to="{ name: 'home', hash: '#about' }" exact
          >about</router-link
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
  justify-content: center;
  align-items: center;
  align-content: center;
  background: linear-gradient(
    269.69deg,
    #fbe2ff 0.3%,
    rgba(251, 226, 255, 0) 99.77%
  );
  @include breakpoint($break-md) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 20px 0 10px;
  }
  @include breakpoint($break-sm) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 20px 0 10px;
  }
  .header-menu {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 4em 0 2em;
    @include breakpoint($break-md) {
      width: 100%;
      padding: 1em 0;
    }
    @include breakpoint($break-sm) {
      width: 100%;
      padding: 1em 0;
    }
    nav {
      display: flex;
      align-items: flex-end;
      text-align: center;
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
        font-style: normal;
        font-weight: 400;
        font-size: 19px;
        line-height: 23px;
        margin-right: 30px;
        padding-bottom: 1px;
        text-decoration: none;
        border-bottom: 1px solid $mint-blue;
        transition: 0.4s;
        cursor: pointer;
        &.hover {
          font-weight: bold;
          border-bottom: none;
        }
        &.focus {
          font-weight: bold;
          border-bottom: none;
        }
        &.active {
          font-weight: bold;
          border-bottom: none;
        }
        @include breakpoint($break-sm) {
          font-size: 18px;
          line-height: 19px;
          margin: 0 10px;
          padding-bottom: 2px;
        }
      }
    }
  }
}
</style>
