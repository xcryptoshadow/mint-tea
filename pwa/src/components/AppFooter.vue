<template>
  <footer id="footer">
    <div class="footer-title">
      <span>Mint, brew &amp; bridge NFTs cross-chain</span>
    </div>
    <div class="footer-menu">
      <nav class="footer-navbar">
        <a
          href="https://ethglobal.com/showcase/mint-tea-2nn7k"
          alt="ETHOnline"
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
<script>
export default {
  name: "AppFooter",
};
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8em;
  color: $white;
  background: $mint-black;

  .footer-title {
    display: flex;
    justify-content: center;
    align-items: center;

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

  .footer-menu {
    display: flex;
    align-items: center;

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
