<script setup>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
</script>
<template>
  <div id="bg-gradient">
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>
<style lang="scss" scoped>
@import "./assets/styles/variables.scss";
@import "./assets/styles/mixins.scss";

#bg-gradient {
  // background-image: url("/brewtube.svg?url");
  background-position: center top;
  background-repeat: no-repeat;
  background-size: auto;
  @include breakpoint($break-md) {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 70%;
  }
  @include breakpoint($break-sm) {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 85%;
  }
  @include breakpoint($break-xs) {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: auto;
  }
}
</style>
