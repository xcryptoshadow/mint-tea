<template>
  <footer id="footer">
    <div class="footer-title">
      <span>Brew up cross-chain NFT's with 🍵 Mint Tea </span>
    </div>
    <div class="footer-menu">
      <nav class="footer-navbar">
        <a href="#" alt="ETHOnline" target="_blank" rel="noopener">ETHOnline</a>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  color: $mint-green;
  background: $mint-black;

  .footer-title {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 1rem;
      a {
        font-size: 1rem;
        color: var(--contrast-color);
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
      font-size: 1rem;

      a {
        font-size: 0.9rem;
        color: $mint-green;
        margin: 0 20px 0 0;
        cursor: pointer;
        &.active {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
