<template>
  <footer id="footer">
    <div class="footer-sponsors">
      <SponsorLogos />
    </div>
  </footer>
</template>
<script setup>
/* Import SVG */
import SponsorLogos from "../assets/svgs/SponsorLogos.vue?component";
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  color: $white;
  background: #2b2b2b;
  border-top: 1px solid #fff;
  padding: 3em 3em 2em 3em;
  overflow: hidden;

  .footer-sponsors {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    width: 100%;
    padding-left: 2%;

    img,
    svg {
      width: 100%;
      object-fit: contain;
      overflow: hidden;
      @include breakpoint($break-md) {
        width: 100%;
      }
      @include breakpoint($break-sm) {
        width: 100%;
      }
      @include breakpoint($break-xs) {
        width: 100%;
      }
    }
  }
}
</style>
