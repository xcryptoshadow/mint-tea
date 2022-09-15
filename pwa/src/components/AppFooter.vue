<template>
  <footer id="footer">
    <div class="footer-title">
      <span>Mint, bridge &amp; brew ross-chain NFTs</span>
    </div>
    <div class="footer-logo">
      <GreenLogo />
    </div>
  </footer>
</template>
<script setup>
/* Import SVG */
import GreenLogo from "../assets/svgs/GreenLogo.vue?component";
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding: 2em;
  color: $white;
  background: $mint-black;

  .footer-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    width: 42%;
    margin-left: 40px;

    span {
      font-size: 1.2rem;
      a {
        font-size: 1.2rem;
        color: $white;
        cursor: pointer;

        &.active {
          font-weight: bold;
        }
      }
    }
  }

  .footer-logo {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
    width: 58%;

    img,
    svg {
      width: 160px;
      object-fit: contain;
      overflow: hidden;
    }
  }
}
</style>
