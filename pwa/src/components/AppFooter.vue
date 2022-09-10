<template>
  <footer id="footer">
    <div class="footer-title">
      <span>Mint, brew &amp; bridge NFTs cross-chain</span>
    </div>
    <div class="footer-logo">
      <GreenLogo />
    </div>
    <div class="footer-menu">
      <nav class="footer-navbar">
        <a
          href="https://ethglobal.com/showcase/mint-tea-2nn7k"
          alt="ETH Online 2022"
          target="_blank"
          rel="noopener"
          >ETHOnline</a
        >
        <a
          href="https://github.com/Mint-Tea-ETHOnline"
          alt="GitHub"
          target="_blank"
          rel="noopener"
          >GitHub</a
        >
      </nav>
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
  padding: 0.8em;
  color: $white;
  background: $mint-black;

  .footer-title {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 45%;

    span {
      font-size: 0.8rem;
      a {
        font-size: 0.8rem;
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
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 10%;

    img,
    svg {
      width: 70px;
      object-fit: contain;
      overflow: hidden;
    }
  }

  .footer-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 45%;

    .footer-navbar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;

      a {
        font-size: 0.8rem;
        color: $white;
        margin: 0 15px 0 0;
        cursor: pointer;
      }
      a:hover {
        color: $mint-orange !important;
        font-weight: bold;
      }
      a:active {
        font-weight: bold;
      }
    }
  }
}
</style>
