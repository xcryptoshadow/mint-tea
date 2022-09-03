<template>
  <footer id="footer">
    <div class="footer-title">
      <span>Brew up cross-chain NFT's with Mint Tea 🍵</span>
    </div>
    <div class="footer-menu">
      <nav class="footer-navbar">
        <a
          href="https://ethglobal.com/showcase/mojo-11hkx"
          alt="HackFS"
          target="_blank"
          rel="noopener"
          >ETH Online</a
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-top 0.5s ease;
  border-top: 1px solid #000000;
  padding: 1em;

  background: #01579b;
  height: 15vh;
  color: #fff;

  .footer-title {
    display: flex;
    align-items: center;
    justify-content: center;

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
        font-size: 0.6rem;
        color: var(--contrast-color);
        cursor: pointer;
        &.active {
          font-weight: bold;
        }
      }

      svg {
        cursor: pointer;
        font-size: 2em;
      }
    }
  }
}
</style>
