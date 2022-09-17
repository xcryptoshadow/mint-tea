<template>
  <footer id="footer">
    <div class="footer-sponsors">
      <SponsorLogos />
    </div>
    <div class="footer-logo">
      <GreenLogo />
    </div>
  </footer>
</template>
<script setup>
/* Import SVG */
import GreenLogo from "../assets/svgs/GreenLogo.vue?component";
import SponsorLogos from "../assets/svgs/SponsorLogos.vue?component";
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  color: $white;
  background: #2b2b2b;
  border-top: 1px solid #fff;
  padding: 3em 3em 2em 3em;

  @include breakpoint($break-lg) {
    width: 100%;
    padding: 2em 2em 1em 0.8em;
  }
  @include breakpoint($break-md) {
    width: 100%;
    padding: 1em 1em 1em 0;
  }
  @include breakpoint($break-sm) {
    width: 100%;
    padding: 1em 1em 1em 0;
  }

  .footer-sponsors {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    width: 48%;
    margin-left: 2%;
  }

  .footer-logo {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    width: 50%;
    margin-right: 40px;
    img,
    svg {
      width: 240px;
      object-fit: contain;
      overflow: hidden;
      @include breakpoint($break-md) {
        width: 200px;
      }
      @include breakpoint($break-sm) {
        width: 200px;
      }
    }
  }
}
</style>
